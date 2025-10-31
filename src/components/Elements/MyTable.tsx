import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from './Dropdown';
import Protector from '../Protector';
import MyPagination from './MyPagination';
import IconVerticalAction from '../Icon/IconVerticalAction';
import IconUpDown from '../Icon/IconUpDown';
import IconDown from '../Icon/IconDown';

/**
 * نوع داده برای اکشن‌های جدول
 * @interface ActionType
 * @property {string[]} [permissions] - دسترسی‌های مورد نیاز برای نمایش اکشن
 * @property {string} title - عنوان اکشن
 * @property {string} key - کلید یکتای اکشن
 */
export interface ActionType {
    permissions?: string[];
    title: string;
    key: string;
}

/**
 * نوع داده برای ستون‌های جدول
 * @interface Column
 * @property {string} title - عنوان ستون
 * @property {string} key - کلید یکتای ستون
 * @property {function} [render] - تابع رندر سفارشی برای محتوای سلول
 * @property {boolean} [sortable] - قابلیت مرتب‌سازی ستون
 * @property {string} [className] - کلاس‌های CSS برای ستون
 */
export interface Column {
    title: string;
    key: string;
    render?: (item: any) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

/**
 * نوع داده برای مرتب‌سازی ستون‌ها
 * @interface SortColumn
 * @property {string} column - کلید ستون برای مرتب‌سازی
 * @property {"asc" | "desc" | null} [direction] - جهت مرتب‌سازی
 */
export interface SortColumn {
    column: string;
    direction?: "asc" | "desc" | null;
}

/**
 * ویژگی‌های کامپوننت جدول
 * @interface TableProps
 * @property {any[]} [rows] - داده‌های جدول
 * @property {Column[]} [columns] - تعریف ستون‌های جدول
 * @property {number} [page] - شماره صفحه جاری
 * @property {number} [take] - تعداد آیتم‌ها در هر صفحه
 * @property {number} [total] - تعداد کل آیتم‌ها
 * @property {SortColumn[]} [sortColumns] - ستون‌های قابل مرتب‌سازی
 * @property {function} [onSortChange] - تابع callback برای تغییر مرتب‌سازی
 * @property {ActionType[]} [actions] - اکشن‌های قابل انجام روی هر ردیف
 * @property {function} [onSelectAction] - تابع callback برای انتخاب اکشن
 * @property {function} [onPageChange] - تابع callback برای تغییر صفحه
 * @property {function} [onTakeChange] - تابع callback برای تغییر تعداد آیتم‌ها در صفحه
 * @property {string} [emptyMessage] - پیام نمایشی در صورت خالی بودن جدول
 * @property {boolean} [loading] - وضعیت لودینگ جدول
 * @property {string} [className] - کلاس‌های CSS اضافی برای جدول
 * @property {string} [checkBoxColumnIdKey] - کلید شناسایی یکتای ردیف‌ها برای چک‌باکس (پیش‌فرض: 'id')
 * @property {boolean} [checkBoxMode] - فعال/غیرفعال کردن حالت چک‌باکس
 * @property {function} [onRowsChecked] - تابع callback برای تغییرات وضعیت چک‌باکس‌ها
 */
interface TableProps {
    rows?: any[];
    columns?: Column[];
    page?: number;
    take?: number;
    total?: number;
    sortColumns?: SortColumn[];
    onSortChange?: (sort: SortColumn) => void;
    actions?: ActionType[];
    onSelectAction?: (actionKey: string, row: any) => void;
    onPageChange?: (page: number) => void;
    onTakeChange?: (take: number) => void;
    emptyMessage?: string;
    loading?: boolean;
    className?: string;
    checkBoxColumnIdKey?: string;
    checkBoxMode?: boolean;
    onRowsChecked?: (isExcludeMode: boolean, selectedRows: any[]) => void;
}

/**
 * کامپوننت جدول پیشرفته با قابلیت‌های:
 * - صفحه‌بندی
 * - مرتب‌سازی
 * - اکشن‌های قابل کنترل با دسترسی
 * - پشتیبانی از حالت تاریک
 * - قابلیت ترجمه
 * - حالت چک‌باکس برای انتخاب چندتایی
 * 
 * @component
 * @param {TableProps} props - ویژگی‌های کامپوننت جدول
 * @returns {JSX.Element} کامپوننت جدول رندر شده
 */
const MyTable = (props: TableProps) => {
    const {
        rows = [],
        columns = [],
        page = 1,
        take = 10,
        total,
        actions = [],
        sortColumns = [],
        onSortChange = () => { },
        onSelectAction = () => { },
        onPageChange = () => { },
        onTakeChange = () => { },
        emptyMessage = 'No data available',
        className = '',
        checkBoxColumnIdKey = 'id',
        checkBoxMode = false,
        onRowsChecked = () => { }
    } = props;

    // مقادیر ممکن برای تعداد آیتم‌ها در هر صفحه
    const takes = [10, 50, 100, 200];

    // هوک ترجمه برای پشتیبانی از چندزبانه
    const { t } = useTranslation();

    // state مدیریت وضعیت داخلی جدول
    const [state, setState] = useState({
        page,          // صفحه جاری
        take,          // تعداد آیتم‌ها در صفحه
        sortColumns: sortColumns || []  // ستون‌های مرتب‌شده
    });

    // state مدیریت وضعیت چک‌باکس‌ها
    const [checkedState, setCheckedState] = useState<{
        allChecked: boolean;           // وضعیت چک‌باکس هدر (انتخاب همه)
        checkedRows: Set<any>;         // مجموعه ردیف‌های انتخاب شده از تمام صفحات
        excludedRows: Set<any>;        // مجموعه ردیف‌های حذف شده از انتخاب همه
    }>({
        allChecked: false,
        checkedRows: new Set(),
        excludedRows: new Set()
    });

    /**
     * محاسبه تعداد کل آیتم‌ها با اولویت دادن به prop total
     * در صورت عدم وجود total از طول آرایه rows استفاده می‌شود
     */
    const totalItems = useMemo(() => total || rows.length, [total, rows.length]);

    /**
     * محاسبه داده‌های صفحه جاری با اعمال صفحه‌بندی
     * این محاسبه به صورت memoized انجام می‌شود برای بهینه‌سازی performance
     */
    const list = useMemo(() => {
        // اگر داده‌ای وجود ندارد آرایه خالی برگردانده می‌شود
        if (!rows?.[0]) return [];

        // محاسبه محدوده داده‌های صفحه جاری
        const from = (state.page - 1) * state.take;
        const to = Math.min(from + state.take, rows.length);

        // برگرداندن بخشی از داده‌ها مربوط به صفحه جاری
        return rows.slice(from, to);
    }, [rows, state.page, state.take]);

    /**
     * بررسی خالی بودن داده‌های جدول
     * این بررسی به صورت memoized انجام می‌شود
     */
    const isEmptyRow = useMemo(() => !rows || rows.length === 0, [rows]);

    /**
     * اثر برای همگام‌سازی state داخلی با props ورودی
     * هنگامی که page, take یا sortColumns تغییر می‌کنند، state داخلی به روز می‌شود
     */
    useEffect(() => {
        setState(prev => ({
            ...prev,
            page,
            take,
            sortColumns: sortColumns || prev.sortColumns
        }));
    }, [page, take, sortColumns]);

    /**
     * اثر برای به روزرسانی وضعیت چک‌باکس‌ها هنگام تغییر صفحه، تعداد آیتم‌ها یا مرتب‌سازی
     * این اثر تضمین می‌کند که وضعیت انتخاب‌ها با تغییرات داده‌ها همگام باشد
     */
    useEffect(() => {
        if (checkedState.allChecked) {
            // اگر حالت انتخاب همه فعال است، تمام ردیف‌های صفحه جاری را انتخاب کن
            const currentPageRowIds = new Set(list.map(row => row[checkBoxColumnIdKey]));
            const newCheckedRows = new Set(checkedState.checkedRows);

            // حذف ردیف‌هایی که در صفحه جاری نیستند اما قبلاً انتخاب شده بودند
            Array.from(newCheckedRows).forEach(rowId => {
                if (!currentPageRowIds.has(rowId)) {
                    newCheckedRows.delete(rowId);
                }
            });

            // اضافه کردن ردیف‌های صفحه جاری
            currentPageRowIds.forEach(rowId => {
                newCheckedRows.add(rowId);
            });

            setCheckedState(prev => ({
                ...prev,
                checkedRows: newCheckedRows
            }));
        }
    }, [state.page, state.take, state.sortColumns, list, checkBoxColumnIdKey]);

    /**
     * اثر برای فراخوانی callback هنگام تغییر وضعیت چک‌باکس‌ها
     * هر بار که checkedRows یا excludedRows تغییر می‌کند، onRowsChecked فراخوانی می‌شود
     */
    useEffect(() => {
        if (checkedState.allChecked) {
            // حالت Exclude Mode: تمام ردیف‌ها انتخاب شده‌اند به جز مواردی که exclude شده‌اند
            const allRowIds = new Set(rows.map(row => row[checkBoxColumnIdKey]));
            const finalCheckedRows = new Set(allRowIds);

            // حذف ردیف‌های exclude شده از انتخاب نهایی
            checkedState.excludedRows.forEach(excludedId => {
                finalCheckedRows.delete(excludedId);
            });

            onRowsChecked(true, Array.from(finalCheckedRows));
        } else {
            // حالت Normal Mode: فقط ردیف‌های انتخاب شده
            onRowsChecked(false, Array.from(checkedState.checkedRows));
        }
    }, [checkedState.allChecked, checkedState.checkedRows, checkedState.excludedRows, rows, checkBoxColumnIdKey, onRowsChecked]);

    /**
     * مدیریت کلیک روی چک‌باکس هدر (انتخاب همه)
     * چرخه حالت‌ها: 
     * - اگر allChecked=false باشد -> همه ردیف‌های تمام صفحات انتخاب می‌شوند (allChecked=true)
     * - اگر allChecked=true باشد -> همه لغو انتخاب می‌شوند (allChecked=false)
     */
    const handleHeaderCheckboxChange = useCallback(() => {
        setCheckedState(prev => {
            if (prev.allChecked) {
                // حالت انتخاب همه غیرفعال می‌شود - همه چک‌باکس‌ها خاموش می‌شوند
                return {
                    allChecked: false,
                    checkedRows: new Set(),
                    excludedRows: new Set()
                };
            } else {
                // حالت انتخاب همه فعال می‌شود - تمام ردیف‌های تمام صفحات انتخاب می‌شوند
                const allRowIds = new Set(rows.map(row => row[checkBoxColumnIdKey]));
                return {
                    allChecked: true,
                    checkedRows: allRowIds,
                    excludedRows: new Set()
                };
            }
        });
    }, [rows, checkBoxColumnIdKey]);

    /**
     * مدیریت کلیک روی چک‌باکس یک ردیف خاص
     * @param {any} rowId - شناسه یکتای ردیف
     * @param {any} row - داده کامل ردیف
     */
    const handleRowCheckboxChange = useCallback((rowId: any, row: any) => {
        setCheckedState(prev => {
            const newCheckedRows = new Set(prev.checkedRows);
            const newExcludedRows = new Set(prev.excludedRows);

            if (prev.allChecked) {
                // اگر حالت انتخاب همه فعال است
                if (newCheckedRows.has(rowId)) {
                    // اگر ردیف انتخاب شده بود، از انتخاب حذف و به excluded اضافه می‌شود
                    newCheckedRows.delete(rowId);
                    newExcludedRows.add(rowId);
                } else {
                    // اگر ردیف انتخاب نشده بود، به انتخاب اضافه و از excluded حذف می‌شود
                    newCheckedRows.add(rowId);
                    newExcludedRows.delete(rowId);
                }
            } else {
                // اگر حالت انتخاب همه غیرفعال است
                if (newCheckedRows.has(rowId)) {
                    newCheckedRows.delete(rowId);
                } else {
                    newCheckedRows.add(rowId);
                }
            }

            return {
                ...prev,
                checkedRows: newCheckedRows,
                excludedRows: newExcludedRows
            };
        });
    }, []);

    /**
     * بررسی وضعیت چک‌باکس یک ردیف خاص
     * @param {any} rowId - شناسه یکتای ردیف
     * @returns {boolean} وضعیت چک‌باکس ردیف
     */
    const isRowChecked = useCallback((rowId: any) => {
        if (checkedState.allChecked) {
            // در حالت انتخاب همه، ردیف انتخاب شده است مگر اینکه در لیست exclude باشد
            return !checkedState.excludedRows.has(rowId);
        } else {
            // در حالت عادی، فقط اگر در لیست checkedRows باشد انتخاب شده است
            return checkedState.checkedRows.has(rowId);
        }
    }, [checkedState.allChecked, checkedState.checkedRows, checkedState.excludedRows]);

    /**
     * بررسی وضعیت چک‌باکس هدر (انتخاب همه)
     * چک‌باکس هدر در حالت indeterminate قرار می‌گیرد اگر:
     * - برخی ردیف‌ها انتخاب شده‌اند اما نه همه
     * @returns {boolean | 'indeterminate'} وضعیت چک‌باکس هدر
     */
    const getHeaderCheckboxState = useCallback((): boolean | 'indeterminate' => {
        if (checkedState.allChecked) {
            // اگر حالت انتخاب همه فعال است، بررسی کن که آیا همه ردیف‌ها انتخاب شده‌اند یا نه
            const allRowIds = new Set(rows.map(row => row[checkBoxColumnIdKey]));
            const allSelected = checkedState.excludedRows.size === 0;

            if (allSelected) {
                return true;
            } else {
                return 'indeterminate';
            }
        }

        if (checkedState.checkedRows.size > 0) {
            return 'indeterminate';
        }

        return false;
    }, [checkedState.allChecked, checkedState.checkedRows, checkedState.excludedRows, rows, checkBoxColumnIdKey]);

    /**
     * مدیریت کلیک روی آیкон مرتب‌سازی
     * چرخه جهت‌های مرتب‌سازی: null -> desc -> asc -> null
     * @param {string} columnKey - کلید ستون مورد نظر برای مرتب‌سازی
     */
    const handleSortClick = useCallback((columnKey: string) => {
        // پیدا کردن ایندکس ستون در آرایه sortColumns
        const sortIndex = state.sortColumns.findIndex(x => x.column === columnKey);

        // اگر ستون پیدا نشد، عملیات متوقف می‌شود
        if (sortIndex === -1) return;

        // ایجاد کپی از آرایه sortColumns برای جلوگیری از mutation مستقیم
        const updatedSortColumns = [...state.sortColumns];
        const currentSort = updatedSortColumns[sortIndex];

        // تعیین جهت جدید بر اساس جهت فعلی
        let newDirection: "asc" | "desc" | null = null;
        if (!currentSort.direction) newDirection = "desc";
        else if (currentSort.direction === "desc") newDirection = "asc";
        else newDirection = null;

        // به روزرسانی جهت مرتب‌سازی برای ستون مورد نظر
        updatedSortColumns[sortIndex] = {
            ...currentSort,
            direction: newDirection
        };

        // به روزرسانی state و فراخوانی callback
        setState(prev => ({ ...prev, sortColumns: updatedSortColumns }));
        onSortChange(updatedSortColumns[sortIndex]);
    }, [state.sortColumns, onSortChange]);

    /**
     * رندر آیкон مرتب‌سازی برای ستون‌ها
     * آیкон بر اساس جهت مرتب‌سازی فعلی تغییر می‌کند
     * @param {string} columnKey - کلید ستون مورد نظر
     * @returns {JSX.Element | null} آیкон مرتب‌سازی یا null
     */
    const renderSortIcon = useCallback((columnKey: string) => {
        // پیدا کردن اطلاعات مرتب‌سازی برای ستون مورد نظر
        const sortItem = state.sortColumns.find(x => x.column === columnKey);

        // اگر ستون قابل مرتب‌سازی نیست، null برگردانده می‌شود
        if (!sortItem) {
            return null;
        }

        const direction = sortItem.direction;

        // حالت اول: بدون مرتب‌سازی (نمایش آیкон خنثی)
        if (!direction) {
            return (
                <button
                    onClick={() => handleSortClick(columnKey)}
                    className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                    title={t('sort') || 'Sort'}
                >
                    <IconUpDown className="rotate-[-180] rtl:-rotate-[-180]" />

                </button>
            );
        }

        // حالت دوم: مرتب‌سازی صعودی (ascending)
        if (direction === "asc") {
            return (
                <button
                    onClick={() => handleSortClick(columnKey)}
                    className="ml-1 text-primary hover:text-primary-dark transition-colors"
                    title={t('sort_asc') || 'Sorted ascending'}
                >
                    <IconDown />

                </button>
            );
        }

        // حالت سوم: مرتب‌سازی نزولی (descending)
        if (direction === "desc") {
            return (
                <button
                    onClick={() => handleSortClick(columnKey)}
                    className="ml-1 text-primary hover:text-primary-dark transition-colors rotate-180"
                    title={t('sort_desc') || 'Sorted descending'}
                >
                    <IconDown />

                </button>
            );
        }

        return null;
    }, [state.sortColumns, handleSortClick, t]);

    /**
     * رندر محتوای سلول‌های جدول
     * اگر تابع render تعریف شده باشد از آن استفاده می‌شود
     * در غیر این صورت مقدار ساده از property مربوطه نمایش داده می‌شود
     * @param {Column} column - تعریف ستون
     * @param {any} row - داده ردیف جاری
     * @returns {React.ReactNode} محتوای رندر شده سلول
     */
    const renderCellContent = useCallback((column: Column, row: any) => {
        // اگر تابع render سفارشی تعریف شده باشد، از آن استفاده کن
        if (column.render) {
            return column.render(row);
        }

        // در غیر این صورت مقدار ساده property را نمایش بده
        return <span className="truncate">{row[column.key]}</span>;
    }, []);

    /**
     * مدیریت کلیک روی اکشن‌های جدول
     * @param {string} actionKey - کلید اکشن انتخاب شده
     * @param {any} row - داده ردیف مربوطه
     */
    const handleActionClick = useCallback((actionKey: string, row: any) => {
        onSelectAction(actionKey, row);
    }, [onSelectAction]);

    /**
     * مدیریت تغییر صفحه
     * @param {number} newPage - شماره صفحه جدید
     */
    const handlePageChange = useCallback((newPage: number) => {
        setState(prev => ({ ...prev, page: newPage }));
        onPageChange(newPage);
    }, [onPageChange]);

    /**
     * مدیریت تغییر تعداد آیتم‌ها در صفحه
     * هنگام تغییر تعداد آیتم‌ها، به صفحه اول برگردانده می‌شود
     * @param {number} newTake - تعداد جدید آیتم‌ها در صفحه
     */
    const handleTakeChange = useCallback((newTake: number) => {
        setState(prev => ({ ...prev, take: newTake, page: 1 }));
        onTakeChange(newTake);
    }, [onTakeChange]);

    /**
     * رندر چک‌باکس هدر (انتخاب همه)
     * @returns {JSX.Element} چک‌باکس هدر
     */
    const renderHeaderCheckbox = useCallback(() => {
        const headerCheckboxState = getHeaderCheckboxState();

        return (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={headerCheckboxState === true}
                        ref={(input) => {
                            if (input) {
                                input.indeterminate = headerCheckboxState === 'indeterminate';
                            }
                        }}
                        onChange={handleHeaderCheckboxChange}
                        className="h-4 w-4 cursor-pointer text-[#4361ee] focus:ring-[#4361ee] pointer border-gray-300 rounded"
                        style={{
                            accentColor: '#4361ee'
                        }}
                    />
                </div>
            </th>
        );
    }, [getHeaderCheckboxState, handleHeaderCheckboxChange]);

    /**
     * رندر چک‌باکس ردیف
     * @param {any} row - داده ردیف
     * @param {number} rowIndex - ایندکس ردیف
     * @returns {JSX.Element} چک‌باکس ردیف
     */
    const renderRowCheckbox = useCallback((row: any, rowIndex: number) => {
        const rowId = row[checkBoxColumnIdKey];
        const isChecked = isRowChecked(rowId);

        return (
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleRowCheckboxChange(rowId, row)}
                    className="h-4 w-4 cursor-pointer text-[#4361ee] focus:ring-[#4361ee] border-gray-300 rounded"
                    style={{
                        accentColor: '#4361ee'
                    }}
                />
            </td>
        );
    }, [checkBoxColumnIdKey, isRowChecked, handleRowCheckboxChange]);

    /**
     * رندر شماره ردیف (زمانی که حالت چک‌باکس غیرفعال است)
     * @param {number} rowIndex - ایندکس ردیف
     * @returns {JSX.Element} سلول شماره ردیف
     */
    const renderRowNumber = useCallback((rowIndex: number) => {
        return (
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {(state.page - 1) * state.take + rowIndex + 1}
            </td>
        );
    }, [state.page, state.take]);

    // بررسی داده‌های نامعتبر - اگر rows یا columns آرایه نباشند
    if (!Array.isArray(rows) || !Array.isArray(columns)) {
        return null;
    }

    return (
        <div className={`table-responsive mb-5 ${className}`}>
            {/* جدول اصلی */}
            <table className="table table-hover table-responsive " style={{ minHeight: "170px" }}>
                {/* هدر جدول */}
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        {/* ستون چک‌باکس یا شماره ردیف */}
                        {checkBoxMode ? renderHeaderCheckbox() : (
                            <th className="">
                                #
                            </th>
                        )}

                        {/* ستون‌های داینامیک بر اساس columns */}
                        {columns.map((column, index) => (
                            <th
                                key={`col-${column.key}-${index}`}
                                className={`${column.className || ''}}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{column.title}</span>
                                    {/* نمایش آیکن مرتب‌سازی اگر ستون قابل مرتب‌سازی باشد */}
                                    {column.sortable !== false && renderSortIcon(column.key)}
                                </div>
                            </th>
                        ))}

                        {/* ستون اکشن‌ها - فقط در صورت وجود اکشن نمایش داده می‌شود */}
                        {actions.length > 0 && (
                            <th className="">
                                {t("action")}
                            </th>
                        )}
                    </tr>
                </thead>

                {/* بدنه جدول */}
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* حالت خالی بودن داده‌ها */}
                    {isEmptyRow ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions.length > 0 ? 2 : 1)}
                                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        /* حالت نمایش داده‌ها */
                        list.map((row, rowIndex) => (
                            <tr
                                key={`row-${row.id || rowIndex}-${state.page}`}
                                className=""
                            >
                                {/* سلول چک‌باکس یا شماره ردیف */}
                                {checkBoxMode ? renderRowCheckbox(row, rowIndex) : renderRowNumber(rowIndex)}

                                {/* سلول‌های داینامیک بر اساس columns */}
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={`cell-${rowIndex}-${colIndex}`}
                                        className={` ${column.className || ''}`}
                                    >
                                        {renderCellContent(column, row)}
                                    </td>
                                ))}

                                {/* سلول اکشن‌ها - فقط در صورت وجود اکشن نمایش داده می‌شود */}
                                {actions.length > 0 && (
                                    <td className="dropdown">
                                        {/* کامپوننت Dropdown برای نمایش منوی اکشن‌ها */}
                                        <Dropdown
                                            placement="bottom-end"
                                            button={
                                                <IconVerticalAction />
                                            }
                                        >
                                            {/* منوی اکشن‌ها */}
                                            <ul className="">
                                                {actions.map((action, indexAction) => (
                                                    /* محافظت از اکشن‌ها بر اساس دسترسی‌ها */
                                                    <Protector
                                                        requiredPermissions={action.permissions}
                                                        key={`action-${action.key}-${indexAction}`}
                                                    >
                                                        <li>
                                                            <button
                                                                type="button"
                                                                className=""
                                                                onClick={() => handleActionClick(action.key, row)}
                                                            >
                                                                {action.title}
                                                            </button>
                                                        </li>
                                                    </Protector>
                                                ))}
                                            </ul>
                                        </Dropdown>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* بخش صفحه‌بندی - فقط در صورت وجود داده نمایش داده می‌شود */}
            {!isEmptyRow && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-4 space-y-3 sm:space-y-0">
                    {/* کامپوننت صفحه‌بندی */}
                    <div className="flex items-center space-x-2">
                        <MyPagination
                            totalItems={totalItems}
                            currentPage={state.page}
                            itemsPerPage={state.take}
                            onPageChange={handlePageChange}
                        />
                    </div>

                    {/* اطلاعات وضعیت و انتخاب تعداد آیتم‌ها */}
                    <div className="flex items-center gap-2">
                        {/* نمایش اطلاعات وضعیت */}
                        <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {t("tabe_status", {
                                first: ((state.page - 1) * state.take + 1),
                                end: ((state.page - 1) * state.take + list.length),
                                total: totalItems
                            })}
                        </span>

                        {/* انتخاب تعداد آیتم‌ها در صفحه */}
                        <select
                            value={state.take}
                            onChange={(e) => handleTakeChange(Number(e.target.value))}
                            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            {takes.map((takeOption) => (
                                <option key={takeOption} value={takeOption}>
                                    {takeOption}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTable;