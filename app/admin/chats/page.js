'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import Loader from '@/components/Shared/Loader';
import { Parser } from '@json2csv/plainjs';
import { FaAngleDown, FaAngleUp, FaDownload } from "react-icons/fa";
import { MdLanguage, MdAccessTime, MdPerson, MdSource } from "react-icons/md";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Paginate from '../../../components/Paginate/Paginate';
import { isValidArray } from '../../../lib/func';
import API from '../../../lib/instance/instance';

const Chats = () => {
    const [isReq, setIsReq] = useState(false);
    const [chats, setChats] = useState({});
//     const [chats, setChats] = useState({
//   "success": true,
//   "status": 200,
//   "message": "Chat fetch!",
//   "paginate": {
//     "totalCount": 1025,
//     "totalPage": 103,
//     "currentPage": 1,
//     "currentLimit": 10,
//     "hasNextPage": true
//   },
//   "data": [
//     {
//       "_id": "68d190559e0fa83b35f7fc29",
//       "responseText": "بالطبع! فيما يلي نموذج **تعميم (أو تعميمات) رسمية** للمنشآت الصحية حول إجراءات التعامل مع حوادث الوخز بالإبر:\n\n---\n\n## تعميم إداري رقم (___)\n### بشأن: إجراءات التعامل مع حوادث وخز الإبر والإبر الملوثة\n\nحرصاً على سلامة جميع منسوبي المنشأة الصحية، وحماية لهم من الأمراض المعدية التي قد تنتقل عن طريق وخز الإبر أو الأدوات الحادة الملوثة، نؤكد على ضرورة الالتزام بما يلي:\n\n1. **الإبلاغ الفوري** عن أي حادثة وخز إبرة أو تعرض لأدوات حادة ملوثة إلى قسم مكافحة العدوى.\n2. **اتباع الإجراءات الإسعافية** بغسل مكان الإصابة مباشرة بالماء والصابون دون عصر أو فرك، وفي حال التعرض للعين أو الفم يجب الشطف بكميات وفيرة من الماء أو المحلول الملحي.\n3. **تعبئة نموذج الإبلاغ** المخصص لحوادث الوخز مع توضيح كافة التفاصيل، ورفع النموذج لمكافحة العدوى لاتخاذ الإجراءات اللازمة.\n4. **التقييم الطبي الفوري** من الطبيب المختص، واتباع الإرشادات العلاجية والوقائية حسب البروتوكول المعتمد بالمنشأة.\n5. **التزام جميع الموظفين** باستخدام معدات الوقاية الشخصية والتخلص الآمن من الإبر والأدوات الحادة بوضعها مباشرة في الحاويات المخصصة مقاومة للثقب، وعدم إعادة تغطية الإبر بعد الاستعمال.\n6. **المشاركة في البرامج التدريبية** التي تنظمها إدارة مكافحة العدوى حول الوقاية من حوادث الوخز.\n\nلذا نهيب بالجميع أخذ الحيطة والحذر، والتعاون معنا لضمان بيئة صحية وآمنة.\n\nمدير المنشأة  \n[الاسم]  \n[التاريخ]  \n\n---\n\nهل تحتاج نموذج تعميم بصيغة Word أو ترغب في تعميم رسمي موجه لقسم معين أو لجميع الأقسام؟ يمكنك إخباري بالتعديل الذي ترغب به.",
//       "inputText": "اريد التعاميم الخاصه بالوخز بالابر",
//       "lang": "en",
//       "createdAt": "2025-09-22T18:07:17.275Z",
//       "updatedAt": "2025-09-22T18:07:17.275Z"
//     }]});
    const [currentPage, setCurrentPage] = useState(1);
    const [moreView, setMoreView] = useState(null);
    const limit = 10;
    const currentLanguage = useSelector(
        (state) => state.language.currentLanguage
    );

    const fetchChats = async (page) => {
        try {
            setIsReq(true);
            const res = await API.get(
                `/api/chat?lang=${currentLanguage}&page=${page || 1}&limit=${limit}`
            );
            if (res.data?.success) {
                setChats(res?.data);
            }
            setIsReq(false);
        } catch (error) {
            setIsReq(false);
        }
    };
    
    useEffect(() => {
        fetchChats(1);
    }, [currentLanguage]);

    const onPageChange = async (page) => {
        setCurrentPage(page);
        await fetchChats(page);
    };

    const downloadCSV = () => {
        if (isValidArray(chats?.data)) {
            const fields = ['InputText', 'ResponseText', 'Lang', 'CreatedAt'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(
                chats.data.map((chat) => ({
                    InputText: chat.inputText,
                    ResponseText: chat.responseText,
                    Lang: chat.lang,
                    CreatedAt: moment(chat.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
                }))
            );

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'chats.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const toggleResponse = (chatId, responseText) => {
        if (moreView?.id === chatId) {
            setMoreView(null);
        } else {
            setMoreView({ id: chatId, text: responseText });
        }
    };

    // Stats calculation
    const totalInteractions = chats?.paginate?.totalDocs || 0;
    const uniqueLanguages = chats?.data ? [...new Set(chats.data.map(chat => chat.lang))].length : 0;

    return (
        <div className="pb-10 pt-5 px-4">
            {/* Header with Stats */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-inter">Chat Interactions</h2>
                    {/* <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        disabled={!isValidArray(chats?.data)}
                    >
                        <FaDownload className="w-4 h-4" />
                        Download
                    </button> */}
                    <button
                     onClick={downloadCSV}
                        disabled={!isValidArray(chats?.data)}
                     className="bg-blue-500 text-white px-4 py-2 flex items-center gap-2 rounded-md mr-6"
                 >
                        <FaDownload className="w-4 h-4" />
                     Download CSV
                 </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center gap-3 mb-2">
                            {/* <div className="p-2 bg-blue-100 rounded-lg">
                                <MdSource className="w-5 h-5 text-blue-600" />
                            </div> */}
                            <span className="text-sm text-gray-600">Total Interactions</span>
                        </div>
                        <div className="text-2xl font-bold">{chats?.paginate?.totalCount}</div>
                        <div className="text-xs text-gray-500">Total chat messages exchanged</div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center gap-3 mb-2">
                            {/* <div className="p-2 bg-green-100 rounded-lg">
                                <MdPerson className="w-5 h-5 text-green-600" />
                            </div> */}
                            <span className="text-sm text-gray-600">Unique Users</span>
                        </div>
                        <div className="text-2xl font-bold">{chats?.paginate?.uniqueCount}</div>
                        <div className="text-xs text-gray-500">Distinct users served</div>
                    </div>

                    {/* <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <MdLanguage className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-sm text-gray-600">Languages</span>
                        </div>
                        <div className="text-2xl font-bold">{uniqueLanguages}</div>
                        <div className="text-xs text-gray-500">Active languages used</div>
                    </div> */}

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <MdAccessTime className="w-5 h-5 text-yellow-600" />
                            </div>
                            <span className="text-sm text-gray-600">Avg Response Time
</span>
                        </div>
                        <div className="text-2xl font-bold">{0.5} ms</div>
                        <div className="text-xs text-gray-500">Average bot response time

</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto max-w-[92vw]">
                    <table className="">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Language
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Response
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User Input
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!isReq && isValidArray(chats?.data) && chats.data.map((chat, index) => (
                                <>
                                    <tr key={chat._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                {/* <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> */}
                                                chat
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {chat.lang}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate max-w-xs">
                                                    {chat.responseText?.substring(0, 25)}...
                                                </span>
                                                <button
                                                    onClick={() => toggleResponse(chat._id, chat.responseText)}
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs whitespace-nowrap"
                                                >
                                                    {moreView?.id === chat._id ? (
                                                        <>
                                                            See Less <FaAngleUp className="w-3 h-3" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            See more <FaAngleDown className="w-3 h-3" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            <div className="max-w-xs truncate" title={chat.inputText}>
                                                {chat.inputText}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-mono text-gray-600">
                                                    {chat._id}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Unknown User
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {moment(chat.createdAt).format('HH:mm A')}
                                                </span>
                                                <span className="text-xs">
                                                    {moment(chat.createdAt).format('MMM D, YYYY')}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    {moreView?.id === chat._id && (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-4 bg-gray-50">
                                                <div className="max-w-full">
                                                    <h4 className="font-medium text-gray-900 mb-2">Full Response:</h4>
                                                    <div className="prose prose-sm max-w-none text-gray-700 bg-white p-4 rounded border">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            rehypePlugins={[rehypeRaw]}
                                                        >
                                                            {moreView.text}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isReq && (
                    <div className="flex items-center justify-center py-8">
                        <Loader />
                    </div>
                )}

                {!isReq && !isValidArray(chats?.data) && (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                        No chat data available
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!isReq && isValidArray(chats?.data) && (
                <div className="py-6 flex justify-center">
                    <Paginate
                        setCurrentPage={setCurrentPage}
                        totalPages={chats?.paginate?.totalPage}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Chats;