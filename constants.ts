
import type { Expression, Style, ScriptType, NumberOfSpeakers, AiProvider, TopicSuggestionItem } from './types';

interface LabeledOption<T> {
  value: T;
  label: string;
}

export const APP_BRAND = {
  name: 'Chú Que Tài Chính',
  channelTagline: 'Video tài chính cá nhân thực chiến cho người Việt',
  defaultLanguage: 'Vietnamese',
} as const;

export const AI_PROVIDER_OPTIONS: LabeledOption<AiProvider>[] = [
    { value: 'kyma', label: 'Kyma API' },
    { value: 'openai', label: 'OpenAI Tương Thích' },
];

export const DEFAULT_KYMA_MODELS: LabeledOption<string>[] = [
    { value: 'qwen-plus', label: 'Qwen 3.6 Plus' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
];

export const OPENAI_MODELS: LabeledOption<string>[] = [
    { value: 'gpt-4o-mini', label: 'Custom: gpt-4o-mini' },
];

export const SCRIPT_TYPE_OPTIONS: LabeledOption<ScriptType>[] = [
    { value: 'Video', label: 'Video YouTube' },
    { value: 'Podcast', label: 'Podcast' },
];

export const NUMBER_OF_SPEAKERS_OPTIONS: LabeledOption<NumberOfSpeakers>[] = [
  { value: 'Auto', label: 'Tự động' },
  { value: '2', label: '2 người' },
  { value: '3', label: '3 người' },
  { value: '4', label: '4 người' },
  { value: '5', label: '5 người' },
];

export const EXPRESSION_OPTIONS: LabeledOption<Expression>[] = [
  { value: 'Empathetic', label: 'Đồng cảm' },
  { value: 'Conversational', label: 'Thân mật' },
  { value: 'Authoritative', label: 'Chuyên gia' },
  { value: 'Analytical', label: 'Phân tích sắc bén' },
];

export const STYLE_OPTIONS: LabeledOption<Style>[] = [
  { value: 'Narrative', label: 'Kể chuyện' },
  { value: 'Analytical', label: 'Phân tích số liệu' },
  { value: 'Storytelling', label: 'Kể chuyện có nhân vật' },
  { value: 'Educational', label: 'Dạy học theo bước' },
];

export const LANGUAGE_OPTIONS: { value: string, label: string }[] = [
    { value: 'Vietnamese', label: 'Tiếng Việt' },
    { value: 'English', label: 'Tiếng Anh' },
];

export const FINANCE_IDEAS: TopicSuggestionItem[] = [
    { category: "AI gợi ý", title: "Sự thật về Lãi Kép: Kỳ quan thứ 8 của Thế giới",
        outline: "Giải thích cơ chế hoạt động của lãi kép, cách nó giúp một khoản đầu tư nhỏ trở thành tài sản khổng lồ theo thời gian. Đưa ra ví dụ thực tế và các công thức đơn giản."
    },
    { category: "AI gợi ý", title: "Tại sao bạn luôn hết tiền vào cuối tháng? (Bẫy thu nhập)",
        outline: "Phân tích tâm lý 'lối sống lạm phát' (Lifestyle creep), khi thu nhập tăng thì chi tiêu cũng tăng theo. Hướng dẫn cách lập ngân sách 50/30/20 để quản lý chi tiêu."
    },
    { category: "AI gợi ý", title: "Đầu tư ETF cho người mới bắt đầu: Chậm mà Chắc",
        outline: "Giới thiệu về Quỹ hoán đổi danh mục (ETF), sự khác biệt giữa ETF và cổ phiếu lẻ. Tại sao Warren Buffett khuyên người bình thường nên đầu tư vào quỹ chỉ số S&P 500."
    },
    { category: "AI gợi ý", title: "Nợ Tốt vs Nợ Xấu: Đừng để thẻ tín dụng làm chủ bạn",
        outline: "Sự khác biệt cốt lõi giữa nợ mang lại giá trị (nợ tốt để kinh doanh, mua tài sản) và nợ tiêu dùng (nợ xấu). Chiến lược 'quả cầu tuyết' để thanh toán dứt điểm nợ thẻ tín dụng."
    },
    { category: "AI gợi ý", title: "Quỹ Dự Phòng Khẩn Cấp: Lá chắn an toàn trong thời kỳ suy thoái",
        outline: "Tại sao mọi kế hoạch tài chính đều cần bắt đầu bằng quỹ dự phòng 3-6 tháng chi phí. Hướng dẫn xây dựng quỹ khẩn cấp hiệu quả và những sai lầm phổ biến cần tránh."
    },
    { category: "AI gợi ý", title: "FIRE (Độc lập tài chính, Nghỉ hưu sớm): Giấc mơ hay Ảo tưởng?",
        outline: "Phân tích trào lưu FIRE. Hướng dẫn cách tính con số FIRE (quy tắc 4%) và chiến lược gia tăng tỷ lệ tiết kiệm để đạt tự do tài chính trước tuổi 40."
    },
    { category: "AI gợi ý", title: "Quy tắc 6 chiếc lọ tài chính: Bí quyết quản lý tiền đỉnh cao",
        outline: "Giới thiệu phương pháp quản lý tài chính JARS của T. Harv Eker. Cách chia thu nhập thành 6 quỹ: Nhu cầu thiết yếu, Giáo dục, Hưởng thụ, Tự do tài chính, Tiết kiệm dài hạn và Cho đi."
    },
    { category: "AI gợi ý", title: "Mua nhà hay Thuê nhà? Bài toán kinh tế ít người dám tính",
        outline: "Phân tích ưu nhược điểm của việc mua nhà trả góp so với thuê nhà và mang tiền đi đầu tư. Cách tính toán dòng tiền để đưa ra quyết định phù hợp với hoàn cảnh cá nhân."
    },
    { category: "AI gợi ý", title: "Bảo hiểm nhân thọ: Tấm khiên bảo vệ hay khoản đầu tư tồi?",
        outline: "Bóc tách sự thật về bảo hiểm nhân thọ. Sự khác biệt giữa bảo hiểm thuần túy và bảo hiểm liên kết đầu tư. Khi nào nên mua và mua bao nhiêu là đủ?"
    },
    { category: "AI gợi ý", title: "Pay Yourself First (Trả cho mình trước): Nguyên tắc số 1 của người giàu",
        outline: "Tại sao việc trích một phần thu nhập để tiết kiệm/đầu tư NGAY khi vừa nhận lương lại thay đổi cuộc đời bạn. Hướng dẫn thiết lập hệ thống tiết kiệm tự động."
    },
    { category: "AI gợi ý", title: "Lạm Phát: Kẻ móc túi thầm lặng của người thích gửi tiết kiệm",
        outline: "Giải thích cơ chế của lạm phát và cách nó bào mòn sức mua của tiền mặt theo thời gian. Chiến lược đầu tư để chiến thắng lạm phát."
    },
    { category: "AI gợi ý", title: "Phân bổ tài sản: Quy tắc 100 trừ đi số tuổi",
        outline: "Cách xây dựng danh mục đầu tư dựa trên độ tuổi và khẩu vị rủi ro. Tỷ lệ vàng giữa cổ phiếu (rủi ro cao) và trái phiếu (an toàn) để tối ưu hóa lợi nhuận."
    },
    { category: "AI gợi ý", title: "Đầu tư Định kỳ (DCA): Chiến lược nhàm chán nhưng hiệu quả nhất",
        outline: "Giới thiệu phương pháp Trung bình giá (Dollar-Cost Averaging). Tại sao việc đầu tư đều đặn mỗi tháng lại vượt trội hơn việc cố gắng 'bắt đáy, bán đỉnh' thị trường."
    },
    { category: "AI gợi ý", title: "Tài sản và Tiêu sản: Bài học vỡ lòng từ 'Cha giàu Cha nghèo'",
        outline: "Phân biệt rõ ràng giữa thứ bỏ tiền vào túi bạn (Tài sản) và thứ lấy tiền ra khỏi túi bạn (Tiêu sản). Tại sao người nghèo mua tiêu sản, người giàu mua tài sản."
    },
    { category: "AI gợi ý", title: "Bẫy tâm lý FOMO trong đầu tư: Đu đỉnh và bài học đắt giá",
        outline: "Phân tích hội chứng Sợ bỏ lỡ (Fear Of Missing Out). Cách nhận biết đám đông đang hưng phấn và chiến lược giữ cái đầu lạnh khi thị trường biến động mạnh."
    },
    { category: "AI gợi ý", title: "Chi phí cơ hội: Khái niệm định hình mọi quyết định tài chính",
        outline: "Giải thích chi phí cơ hội là gì. Tại sao việc chọn mua một chiếc iPhone mới hôm nay có thể đánh đổi bằng hàng trăm triệu đồng trong 10 năm tới."
    },
    { category: "AI gợi ý", title: "Quy tắc 72: Nhẩm tính thời gian nhân đôi tài sản trong 3 giây",
        outline: "Công thức toán học thần thánh của dân tài chính. Hướng dẫn cách dùng Quy tắc 72 để đánh giá nhanh hiệu quả của một kênh đầu tư."
    },
    { category: "AI gợi ý", title: "Chứng chỉ quỹ mở: Cách người bận rộn thuê chuyên gia đầu tư",
        outline: "Khái niệm quỹ mở là gì? Ưu điểm khi ủy thác vốn cho các chuyên gia tài chính. Cách chọn một chứng chỉ quỹ uy tín và phù hợp với mục tiêu."
    },
    { category: "AI gợi ý", title: "Chi phí chìm (Sunk Cost Fallacy): Tại sao chúng ta cố chấp giữ khoản lỗ?",
        outline: "Giải mã hiệu ứng tâm lý khiến nhà đầu tư không dám 'cắt lỗ' hoặc tiếp tục đổ tiền vào dự án không hiệu quả. Cách vượt qua bẫy chi phí chìm."
    },
    { category: "AI gợi ý", title: "Bẫy thẻ tín dụng: Từ tiện ích đến vòng xoáy nợ nần",
        outline: "Cách các ngân hàng kiếm tiền từ thẻ tín dụng. Các cạm bẫy như 'thanh toán tối thiểu', phí phạt trễ hạn và chiến lược dùng thẻ để tận dụng ưu đãi mà không mất tiền oan."
    },
    { category: "AI gợi ý", title: "Tài chính vợ chồng: Tiền chung hay Tiền riêng?",
        outline: "Các mô hình quản lý tài chính trong gia đình. Cách trao đổi minh bạch về tiền bạc với bạn đời để tránh xung đột và cùng nhau xây dựng sự thịnh vượng."
    },
    { category: "AI gợi ý", title: "Đầu tư vào bản thân: Kênh đầu tư có ROI cao nhất",
        outline: "Tại sao nâng cao kỹ năng, học ngoại ngữ hay chăm sóc sức khỏe lại là khoản đầu tư không bao giờ lỗ. Cách định giá bản thân để đàm phán lương hiệu quả."
    },
    { category: "AI gợi ý", title: "Thu nhập Thụ động vs Chủ động: Xây dựng đường ống nước",
        outline: "Sự khác biệt giữa việc xách nước (làm công ăn lương) và xây đường ống (tạo nguồn thu thụ động). Các ý tưởng tạo thu nhập thụ động thiết thực cho người trẻ."
    },
    { category: "AI gợi ý", title: "Quản lý tài chính cho Freelancer (Người làm tự do)",
        outline: "Những khó khăn khi dòng tiền không đều đặn mỗi tháng. Chiến lược lập ngân sách, đóng thuế và tự xây dựng quỹ hưu trí cho freelancer."
    },
    { category: "AI gợi ý", title: "Hiệu ứng Chim mồi (Decoy Effect) trong tiêu dùng",
        outline: "Phân tích cách các siêu thị, quán cafe thao túng tâm lý người mua bằng việc đưa ra các mức giá mồi. Bí kíp nhận diện và từ chối chi tiêu không cần thiết."
    },
    { category: "AI gợi ý", title: "Kế hoạch tài chính cho người độc thân",
        outline: "Lợi thế và thách thức tài chính của người chưa lập gia đình. Cách lập kế hoạch mua nhà, mua bảo hiểm và chuẩn bị cho tương lai xa mà không phụ thuộc vào ai."
    },
    { category: "AI gợi ý", title: "Chuẩn bị tài chính trước khi sinh con: Đừng để tiền làm mờ niềm vui",
        outline: "Những khoản chi phí khổng lồ khi có em bé mà ít người tính đến. Các bước chuẩn bị ngân sách thai sản, bỉm sữa và quỹ giáo dục từ sớm."
    },
    { category: "AI gợi ý", title: "Trái phiếu doanh nghiệp: Lợi nhuận cao đi kèm rủi ro gì?",
        outline: "Khái niệm trái phiếu, sự khác biệt giữa trái phiếu chính phủ và doanh nghiệp. Cách đọc hiểu bản cáo bạch và đánh giá rủi ro vỡ nợ trước khi mua."
    },
    { category: "AI gợi ý", title: "Tính Thanh Khoản: Tại sao người giàu bất động sản vẫn có thể phá sản?",
        outline: "Định nghĩa thanh khoản (khả năng chuyển đổi thành tiền mặt). Tầm quan trọng của việc duy trì tài sản có tính thanh khoản cao để ứng phó với khủng hoảng."
    },
    { category: "AI gợi ý", title: "Crypto (Tiền mã hóa): Tương lai tài chính hay Sòng bạc công nghệ?",
        outline: "Cái nhìn khách quan về Bitcoin và tiền mã hóa. Những nguyên tắc cốt lõi khi tham gia thị trường rủi ro cao: Chỉ đầu tư số tiền có thể mất và cách lưu trữ an toàn."
    },
    { category: "AI gợi ý", title: "Quỹ hưu trí tự nguyện: Lo xa không bao giờ thừa",
        outline: "Tại sao lương hưu BHXH có thể không đủ để bạn sống an nhàn? Tìm hiểu về quỹ hưu trí bổ sung tự nguyện và sức mạnh của việc tích lũy từ sớm."
    },
    { category: "AI gợi ý", title: "Nghệ thuật đàm phán lương: Đừng để bản thân bị định giá thấp",
        outline: "Các kỹ năng chuẩn bị trước buổi phỏng vấn đánh giá năng lực. Cách nghiên cứu thị trường, nêu bật giá trị bản thân và chiến lược deal lương win-win."
    },
    { category: "AI gợi ý", title: "Báo cáo tài chính cá nhân: Bắt mạch sức khỏe dòng tiền",
        outline: "Cách lập Bảng Cân Đối Kế Toán và Báo Cáo Kết Quả Kinh Doanh cho chính bạn. 3 chỉ số quan trọng cần theo dõi: Giá trị tài sản ròng, Tỷ lệ tiết kiệm và Tỷ lệ nợ/tài sản."
    },
    { category: "AI gợi ý", title: "Cạm bẫy 'Làm giàu nhanh' (Get-rich-quick schemes)",
        outline: "Dấu hiệu nhận biết các mô hình Ponzi, đa cấp lừa đảo núp bóng đầu tư tài chính. Khẳng định chân lý: Lợi nhuận cao không rủi ro là lời nói dối."
    },
    { category: "AI gợi ý", title: "Đầu tư chứng khoán với vốn nhỏ: Bắt đầu từ 1 triệu đồng",
        outline: "Xóa bỏ định kiến 'phải có nhiều tiền mới đầu tư được'. Các bước mở tài khoản, chọn mua cổ phiếu lô lẻ hoặc ETF với số vốn khiêm tốn mỗi tháng."
    },
    { category: "AI gợi ý", title: "Quản lý nợ vay mua nhà: Trả bớt gốc sớm hay mang tiền đi đầu tư?",
        outline: "Phân tích bài toán lợi ích giữa việc dồn tiền trả nợ ngân hàng để giảm lãi và việc mang số tiền đó đi đầu tư sinh lời. Khi nào nên tất toán sớm?"
    },
    { category: "AI gợi ý", title: "Tự do tài chính có thực sự mang lại hạnh phúc?",
        outline: "Góc nhìn sâu sắc về mục đích cuối cùng của việc kiếm tiền. Tiền là phương tiện, không phải đích đến. Cách cân bằng giữa việc tích lũy và tận hưởng cuộc sống hiện tại."
    },
    { category: "AI gợi ý", title: "Bí quyết tiết kiệm tiền khi đi du lịch",
        outline: "Cách lập kế hoạch tài chính cho chuyến đi xa. Kỹ năng săn vé rẻ, chọn chỗ ở hợp lý và quản lý chi tiêu để có trải nghiệm tuyệt vời mà không 'lủng ví'."
    },
    { category: "AI gợi ý", title: "Hiệu ứng Dunning-Kruger: Kẻ thù của nhà đầu tư F0",
        outline: "Giải thích ảo tưởng sức mạnh của người mới bước chân vào thị trường tài chính. Tại sao việc biết một chút thường nguy hiểm hơn là không biết gì, và cách rèn luyện sự khiêm tốn."
    },
    { category: "AI gợi ý", title: "Thói quen nhỏ, Tài sản to (Bản lề của nguyên tử)",
        outline: "Ứng dụng cuốn sách 'Atomic Habits' vào tài chính. Làm thế nào một thay đổi nhỏ bé như tự pha cafe thay vì mua ngoài có thể thay đổi cục diện tài chính trong dài hạn."
    },
    { category: "AI gợi ý", title: "Đầu tư Vàng: Kênh trú ẩn an toàn qua các thời kỳ",
        outline: "Đặc tính lịch sử của vàng. Tại sao vàng luôn tăng giá trong dài hạn và khủng hoảng. Cách phân bổ một tỷ lệ hợp lý của danh mục vào kim loại quý."
    },
    { category: "AI gợi ý", title: "Tâm lý bầy đàn trong đầu tư chứng khoán",
        outline: "Tại sao đám đông thường sai ở những điểm xoay chiều của thị trường. Cách nhận diện sự điên rồ của đám đông và chiến lược đầu tư ngược chiều (Contrarian investing)."
    },
    { category: "AI gợi ý", title: "Chi phí ẩn của việc sở hữu ô tô",
        outline: "Phân tích bài toán tài chính đằng sau chiếc xe hơi. Khấu hao, phí bảo trì, bảo hiểm, bãi đỗ... Tại sao ô tô là một trong những tiêu sản lớn nhất của người trẻ."
    },
    { category: "AI gợi ý", title: "Khủng hoảng tuổi 30: Áp lực đồng trang lứa (Peer pressure)",
        outline: "Làm sao để vượt qua cảm giác tự ti khi thấy bạn bè xung quanh mua nhà, mua xe. Cách tập trung vào đường đua của riêng mình và định nghĩa lại thành công."
    },
    { category: "AI gợi ý", title: "Sức mạnh của Lãi suất Kép trong việc trả nợ",
        outline: "Góc tối của lãi kép. Khi bạn nợ, lãi kép làm việc chống lại bạn như thế nào. Chiến lược ưu tiên trả các khoản nợ có lãi suất cao nhất (Avalanche method)."
    },
    { category: "AI gợi ý", title: "Tài chính cho sinh viên mới ra trường",
        outline: "Cẩm nang sinh tồn tài chính trong những năm tháng lương thấp. Cách thiết lập thói quen chi tiêu chuẩn mực ngay từ tháng lương đầu tiên."
    },
    { category: "AI gợi ý", title: "Hiểu đúng về Chỉ số P/E khi chọn cổ phiếu",
        outline: "Khái niệm Price-to-Earnings. Cổ phiếu P/E thấp có phải luôn rẻ? Cổ phiếu P/E cao có phải luôn đắt? Cách dùng P/E để định giá sơ bộ doanh nghiệp."
    },
    { category: "AI gợi ý", title: "Cách vượt qua khủng hoảng tài chính cá nhân (Mất việc, Phá sản)",
        outline: "Các bước thiết thực để đứng lên sau biến cố. Cách cắt giảm chi phí tối đa, thương lượng giãn nợ và tìm kiếm nguồn thu nhập thay thế trong ngắn hạn."
    },
    { category: "AI gợi ý", title: "Đầu tư giá trị vs Đầu tư tăng trưởng",
        outline: "So sánh hai trường phái đầu tư kinh điển. Tìm hiểu phong cách của Warren Buffett (Giá trị) và Peter Lynch (Tăng trưởng) để áp dụng vào danh mục cá nhân."
    },
    { category: "AI gợi ý", title: "Thuế Thu nhập Cá nhân: Những điều người lao động cần biết",
        outline: "Cách tính thuế TNCN cơ bản. Các khoản giảm trừ gia cảnh và phương pháp hợp pháp để tối ưu hóa số thuế phải nộp hằng năm."
    },
    { category: "AI gợi ý", title: "Bất động sản dòng tiền: Trái ngọt hay cục nợ?",
        outline: "Tìm hiểu mô hình xây nhà trọ, căn hộ dịch vụ cho thuê. Phân tích bài toán chi phí quản lý, khấu hao và lợi suất cho thuê so với lãi suất ngân hàng."
    },
    { category: "AI gợi ý", title: "Tâm lý học về tiền bạc (The Psychology of Money)",
        outline: "Tóm tắt những bài học đắt giá từ cuốn sách cùng tên của Morgan Housel. Tại sao sự giàu có phụ thuộc vào hành vi của bạn nhiều hơn là sự thông minh."
    },
    { category: "AI gợi ý", title: "Khởi nghiệp (Startup) bằng tiền túi (Bootstrapping) hay gọi vốn?",
        outline: "Bài toán tài chính cho người bắt đầu kinh doanh. Lợi thế của việc tự làm tự ăn so với việc chia sẻ cổ phần cho các quỹ đầu tư."
    },
    { category: "AI gợi ý", title: "Thiết kế lối sống tối giản (Minimalism) để tự do tài chính",
        outline: "Sự liên hệ mật thiết giữa lối sống tối giản và sự giàu có. Cách loại bỏ những thứ không mang lại niềm vui để có thêm nguồn lực cho những mục tiêu lớn hơn."
    },
    { category: "AI gợi ý", title: "Làm thế nào để sống sót với 10 triệu đồng/tháng tại thành phố lớn?",
        outline: "Cẩm nang sinh tồn thực tế cho sinh viên mới ra trường và người trẻ. Chiến lược quản lý ngân sách siêu chặt chẽ, tối ưu hóa chi phí thuê nhà, ăn uống và đi lại."
    },
    { category: "AI gợi ý", title: "1 Tỷ đầu tiên: Hành trình gian nan và cách vượt qua",
        outline: "Vì sao Charlie Munger nói '100.000 USD đầu tiên là một con khốn'. Phân tích tâm lý và chiến lược tích lũy để đạt được cột mốc tài sản đầu tiên một cách nhanh nhất."
    },
    { category: "AI gợi ý", title: "Tiêu xài theo cảm xúc (Emotional Spending) và cách chữa trị",
        outline: "Phân tích nguyên nhân tâm lý đằng sau những đợt mua sắm 'trả thù' khi buồn chán hoặc stress. 3 bước thiết thực để ngắt kết nối giữa cảm xúc và chiếc ví của bạn."
    },
    { category: "AI gợi ý", title: "Quy tắc 24h: Mẹo tâm lý để chống lại 'vung tay quá trán'",
        outline: "Cách trì hoãn sự sung sướng bằng luật 24 giờ. Cơ chế hoạt động của não bộ khi khao khát mua sắm và làm thế nào một ngày chờ đợi có thể cứu bạn khỏi những khoản nợ vô hình."
    },
    { category: "AI gợi ý", title: "Side Hustle: Kiếm thêm 5-10 triệu/tháng ngoài giờ hành chính",
        outline: "Tổng hợp các ý tưởng nghề tay trái thực tế (Freelance, Affiliate, Sáng tạo nội dung) không đòi hỏi quá nhiều vốn. Cách cân bằng thời gian để không ảnh hưởng đến công việc chính."
    },
    { category: "AI gợi ý", title: "Đòn bẩy Tài chính (Opm - Other People's Money): Vũ khí của giới tỷ phú",
        outline: "Khái niệm sử dụng tiền của người khác để làm giàu. Cách những nhà đầu tư sành sỏi dùng nợ ngân hàng làm đòn bẩy gia tăng tài sản, và những rủi ro 'cháy túi' đi kèm."
    },
    { category: "AI gợi ý", title: "3 Sai lầm tài chính lớn nhất tuổi 20 bạn nhất định phải tránh",
        outline: "Tổng hợp những cú vấp ngã phổ biến: Không tiết kiệm sớm, mua tiêu sản đắt tiền để khoe mẽ, và phớt lờ sức mạnh của lãi kép. Lời khuyên từ những người đi trước."
    },
    { category: "AI gợi ý", title: "Chơi Hụi (Họ, Biêu, Phường): Văn hóa truyền thống hay Cạm bẫy rủi ro?",
        outline: "Giải thích cơ chế của việc chơi hụi dưới góc nhìn tài chính. Phân tích bài toán lợi nhuận so với rủi ro vỡ hụi, giật hụi và các lựa chọn thay thế an toàn hơn."
    },
    { category: "AI gợi ý", title: "Mua sắm trả góp 0%: Cái bẫy ngọt ngào của các sàn thương mại",
        outline: "Sự thật đằng sau những lời mời chào trả góp 0%. Cách các công ty tài chính thu lời từ phí chuyển đổi, phí thường niên và bẫy tâm lý khiến bạn chi tiêu nhiều hơn khả năng."
    },
    { category: "AI gợi ý", title: "Có 100 triệu nhàn rỗi nên làm gì để sinh lời an toàn?",
        outline: "Gợi ý các kênh phân bổ vốn cho số tiền 100 triệu: Gửi tiết kiệm, Mua vàng, Chứng chỉ quỹ, Cổ phiếu rổ VN30. Đánh giá ưu nhược điểm từng kênh cho người mới."
    },
    { category: "AI gợi ý", title: "Hiệu ứng Mỏ neo (Anchoring Effect) trong thương lượng giá cả",
        outline: "Cách não bộ bị đánh lừa bởi con số đầu tiên được đưa ra. Áp dụng hiệu ứng mỏ neo để đàm phán lương, mua nhà, mua xe hoặc từ chối những chiêu trò giảm giá ảo."
    },
    { category: "AI gợi ý", title: "Nghệ thuật Bán hàng: Kỹ năng sinh tồn số 1 của người giàu",
        outline: "Tại sao tỷ phú nào cũng là một người bán hàng xuất sắc? Cách tư duy về bán hàng không phải là 'móc túi' người khác mà là trao đi giá trị và giải quyết vấn đề."
    },
    { category: "AI gợi ý", title: "Lương 15 triệu có nên vay mua Ô tô trả góp?",
        outline: "Một bài toán chi tiết mổ xẻ mọi chi phí ẩn của việc nuôi xe lăn bánh (bãi đỗ, bảo hiểm, khấu hao, lãi vay). Lời cảnh tỉnh cho những ai muốn mua xe vì 'sĩ diện'."
    },
    { category: "AI gợi ý", title: "Cổ tức là gì? Xây cỗ máy in tiền bằng Đầu tư ăn cổ tức",
        outline: "Giải thích khái niệm cổ tức và tỷ suất cổ tức (Dividend Yield). Chiến lược chọn lọc các doanh nghiệp 'bò sữa' trả cổ tức đều đặn để tạo dòng tiền thụ động vững chắc."
    },
    { category: "AI gợi ý", title: "Quyền năng của từ 'KHÔNG' trong quản lý tài chính",
        outline: "Làm thế nào để từ chối những cuộc vui tốn kém, những lời mời gọi vay mượn từ người thân mà không mất lòng. Kỷ luật bảo vệ chiếc ví của chính mình."
    },
    { category: "AI gợi ý", title: "Mối liên hệ bất ngờ giữa Sức khỏe Thể chất và Sức khỏe Tài chính",
        outline: "Sự thật: Giường bệnh là chiếc giường đắt nhất thế giới. Tại sao đầu tư vào giấc ngủ, ăn uống lành mạnh và tập thể dục lại giúp bạn tiết kiệm hàng trăm triệu đồng viện phí."
    },
    { category: "AI gợi ý", title: "Network is Net worth (Quan hệ là Tiền tệ): Đầu tư vào con người",
        outline: "Tầm quan trọng của việc xây dựng mạng lưới quan hệ chất lượng. Cách phân bổ ngân sách 'giao tiếp' để gặp gỡ những người giỏi hơn và mở ra các cơ hội thăng tiến."
    },
    { category: "AI gợi ý", title: "Vòng luẩn quẩn của sự nghèo đói (Poverty Trap) và cách phá vỡ",
        outline: "Phân tích những rào cản hệ thống khiến người nghèo khó thoát nghèo (thiếu thông tin, nợ lãi cao, thiếu vốn). Chiến lược cá nhân để vượt qua nghịch cảnh và vươn lên."
    },
    { category: "AI gợi ý", title: "Sự tĩnh lặng khi thị trường hoảng loạn: Bài học từ sói già phố Wall",
        outline: "Tâm lý hành vi khi thị trường chứng khoán sập đỏ lửa. Cách rèn luyện tinh thần thép, tắt app và tìm kiếm cơ hội 'mua tài sản giá rẻ' khi người khác sợ hãi."
    },
    { category: "AI gợi ý", title: "Khi nào nên Bán cổ phiếu? Kỷ luật Cắt lỗ và Chốt lời",
        outline: "Đa số mọi người biết khi nào nên mua nhưng lại mù tịt khi nào nên bán. Nguyên tắc bán theo phân tích cơ bản, kỹ thuật và cách loại bỏ cảm xúc 'tiếc nuối'."
    },
    { category: "AI gợi ý", title: "Bảo hiểm Y tế tự nguyện: Tấm khiên rẻ nhất nhưng quyền lực nhất",
        outline: "Đừng vội mua bảo hiểm nhân thọ tiền chục triệu nếu chưa có Bảo hiểm y tế Nhà nước. Cách tận dụng BHYT để giảm đến 80% gánh nặng viện phí khi rủi ro ập tới."
    },
    { category: "AI gợi ý", title: "Xây dựng Thương hiệu cá nhân (Personal Branding) để nhân 3 thu nhập",
        outline: "Trong thời đại Digital, uy tín cá nhân là một tài sản có thể quy ra tiền. Cách sử dụng mạng xã hội chuyên nghiệp để thu hút nhà tuyển dụng và khách hàng tiềm năng."
    },
    { category: "AI gợi ý", title: "Đầu tư Đất nền vùng ven: Góc khuất phân lô bán nền",
        outline: "Lợi nhuận x2, x3 từ đất nền có thật không? Cảnh báo các bẫy quy hoạch, pháp lý, sổ chung và tính thanh khoản bằng không mà cò đất không bao giờ nói cho bạn."
    },
    { category: "AI gợi ý", title: "Có nên cho người thân, bạn bè vay tiền? Nguyên tắc để không mất cả hai",
        outline: "Góc nhìn tài chính về việc cho vay mượn trong các mối quan hệ thân thiết. Quy tắc bất thành văn: Chỉ cho vay số tiền bạn sẵn sàng mất, và cách từ chối khéo léo."
    },
    { category: "AI gợi ý", title: "Quản lý ngân sách bằng Spreadsheet (Excel/Google Sheets) thần thánh",
        outline: "Bỏ qua các app phức tạp, tại sao một bảng tính Excel đơn giản lại là công cụ quyền lực nhất? Hướng dẫn tự thiết kế bảng theo dõi thu chi phù hợp với bản thân."
    },
    { category: "AI gợi ý", title: "Sức mạnh của Tư duy Dài hạn (Long-term thinking) trong thế giới vội vã",
        outline: "Sự khác biệt giữa tư duy 'mì ăn liền' và tư duy trồng cây cổ thụ. Áp dụng tư duy dài hạn vào việc chọn nghề, chọn bạn đời và xây dựng danh mục đầu tư."
    },
    { category: "AI gợi ý", title: "Tài chính cho người sắp Ly hôn: Bảo vệ tài sản hợp pháp",
        outline: "Những vấn đề nhạy cảm nhưng thực tế khi hôn nhân đổ vỡ. Cách chuẩn bị hồ sơ tài chính, phân chia nợ nần và tài sản chung một cách minh bạch, đúng luật."
    },
    { category: "AI gợi ý", title: "Định luật Parkinson: Tại sao bạn luôn tiêu hết những gì kiếm được?",
        outline: "Lý giải hiện tượng 'công việc luôn nở ra để lấp đầy thời gian' áp dụng vào tiền bạc: 'Chi tiêu luôn nở ra để lấp đầy thu nhập'. Cách phá vỡ định luật này."
    },
    { category: "AI gợi ý", title: "Chiến lược trả nợ bằng phương pháp Quả Cầu Tuyết (Snowball)",
        outline: "Hướng dẫn chi tiết cách thanh toán các khoản nợ từ nhỏ đến lớn để tạo động lực tâm lý (Quick wins). Tại sao đôi khi toán học phải nhường bước cho tâm lý học."
    },
    { category: "AI gợi ý", title: "Tự do tài chính không có nghĩa là 'Không làm gì cả'",
        outline: "Xóa bỏ ảo tưởng về việc nằm dài trên bãi biển uống cocktail cả đời. Ý nghĩa thực sự của tự do tài chính là quyền 'Lựa chọn' công việc bạn yêu thích mà không vì tiền."
    },
    { category: "AI gợi ý", title: "Quy tắc 50/30/20 có còn phù hợp với thời giá hiện nay?",
        outline: "Đánh giá lại quy tắc quản lý tài chính kinh điển. Cách biến tấu và linh hoạt điều chỉnh tỷ lệ này khi lạm phát cao và chi phí thuê nhà chiếm quá nửa thu nhập."
    },
    { category: "AI gợi ý", title: "Đầu tư vào giáo dục con cái: Bài toán kinh tế và Tình yêu thương",
        outline: "Trường quốc tế hay trường công? Các quỹ học vấn tương lai. Cách tính toán chi phí nuôi dạy con và giáo dục tài chính cho trẻ từ sớm để chúng tự lập."
    },
    { category: "AI gợi ý", title: "Kinh doanh Online vốn 0 đồng: Sự thật hay những lời hứa hẹn ảo?",
        outline: "Phân biệt giữa Dropshipping, Affiliate Marketing chân chính và các mô hình lùa gà khóa học. Những kỹ năng thực sự cần có để kiếm tiền trên Internet."
    },
    { category: "AI gợi ý", title: "Phân tích Chi phí - Lợi ích (Cost-Benefit) áp dụng vào đời sống",
        outline: "Công cụ tư duy của các CEO. Hướng dẫn cách lập bảng so sánh thiệt hơn (Tiền bạc, Thời gian, Cảm xúc) trước khi đưa ra bất kỳ quyết định lớn nào trong đời."
    },
    { category: "AI gợi ý", title: "Làm thế nào để nghỉ hưu với 10 tỷ đồng từ con số 0?",
        outline: "Một lộ trình mô phỏng thực tế bằng những con số. Tính toán mức đóng góp hàng tháng, lãi suất kỳ vọng và thời gian để đạt được cột mốc 10 tỷ an hưởng tuổi già."
    },
    { category: "AI gợi ý", title: "Sổ tiết kiệm vs Tiết kiệm linh hoạt trên Ví điện tử",
        outline: "So sánh hiệu quả và tính an toàn giữa việc gửi tiết kiệm ngân hàng truyền thống và các sản phẩm sinh lời theo ngày trên MoMo, ZaloPay, ViettelPay."
    },
    { category: "AI gợi ý", title: "Bẫy thu nhập trung bình (Middle-income trap) ở cấp độ cá nhân",
        outline: "Tại sao nhiều người kẹt ở mức lương 20-30 triệu suốt nhiều năm mà không thể bứt phá. Cách nâng cấp kỹ năng (Upskill) để nhảy vọt lên phân khúc thu nhập cao."
    },
    { category: "AI gợi ý", title: "Thiết lập Quỹ Khẩn Cấp trong thời kỳ lạm phát cao",
        outline: "Nên để bao nhiêu tiền mặt khi tiền đang mất giá? Cách phân bổ Quỹ khẩn cấp thành nhiều tầng (Tiền mặt, Gửi không kỳ hạn, Gửi kỳ hạn ngắn) để tối ưu lãi."
    },
    { category: "AI gợi ý", title: "Hiệu ứng Hào quang (Halo Effect) trong việc chọn chuyên gia tài chính",
        outline: "Đừng mù quáng tin vào những 'Thầy bà' mặc vest, đi xe sang trên mạng. Cách đánh giá một lời khuyên tài chính có thực sự chất lượng hay chỉ là phông bạt."
    },
    { category: "AI gợi ý", title: "Khám phá bí mật về 'Lãi suất Thực' (Real Interest Rate)",
        outline: "Lãi suất danh nghĩa trừ đi Lạm phát. Tại sao gửi ngân hàng lãi 6%/năm nhưng lạm phát 4% thì bạn chỉ thực sự nhận được 2% giá trị tăng thêm."
    },
    { category: "AI gợi ý", title: "Thương hiệu cao cấp (Luxury Brands) và thuế đánh vào sự phù phiếm",
        outline: "Phân tích mô hình kinh doanh của các thương hiệu xa xỉ. Tại sao việc mua đồ hiệu bằng thẻ tín dụng là cách nhanh nhất để phá hủy tương lai tài chính của bạn."
    },
    { category: "AI gợi ý", title: "Cân bằng giữa Tích lũy cho tương lai và Sống cho hiện tại (YOLO)",
        outline: "Ranh giới mong manh giữa tiết kiệm cực đoan (khổ hạnh) và tiêu xài hoang phí. Hướng dẫn cách phân bổ quỹ 'Play' để tự thưởng cho bản thân không hối tiếc."
    },
    { category: "AI gợi ý", title: "Đọc vị các bản hợp đồng: Thói quen cứu bạn khỏi những vụ lừa đảo",
        outline: "Tầm quan trọng của việc soi kỹ 'dòng chữ nhỏ' (Fine print) trong hợp đồng vay vốn, hợp đồng bảo hiểm và mua bán nhà đất. Những rủi ro pháp lý cần tránh."
    },
    { category: "AI gợi ý", title: "Chiến lược Mua sỉ, Dùng chung để chống bão giá",
        outline: "Kinh tế chia sẻ áp dụng vào cá nhân. Lợi ích tài chính của việc mua chung tài khoản Netflix, Spotify, mua hàng sỉ hoặc chia sẻ chi phí thuê nhà với người khác."
    },
    { category: "AI gợi ý", title: "Hiểu về vòng quay kinh tế: Hưng thịnh, Suy thoái và Khủng hoảng",
        outline: "Kiến thức vĩ mô cơ bản nhưng sống còn. Cách nhận biết chúng ta đang ở đâu trong chu kỳ kinh tế để quyết định nên tấn công (đầu tư) hay phòng thủ (giữ tiền mặt)."
    },
    { category: "AI gợi ý", title: "Nghề Reviewer/KOL: Hào quang mạng xã hội và góc khuất thu nhập",
        outline: "Giải mã cách các nhà sáng tạo nội dung kiếm tiền từ nhãn hàng. Những bất ổn tài chính khi thu nhập phụ thuộc vào thuật toán của nền tảng (TikTok, YouTube)."
    },
    { category: "AI gợi ý", title: "Môn học Tài chính cá nhân: Lỗ hổng lớn nhất của hệ thống giáo dục",
        outline: "Tại sao trường học dạy bạn tính tích phân nhưng không dạy cách tính lãi ngân hàng? Những kiến thức bắt buộc phụ huynh phải tự dạy cho con cái ngay từ nhỏ."
    },
    { category: "AI gợi ý", title: "Quản trị rủi ro toàn diện: Bảo vệ bản thân bằng nhiều lớp khiên",
        outline: "Tóm lược bộ 3 bảo vệ tài chính hoàn hảo: Quỹ khẩn cấp (Ngắn hạn) - Bảo hiểm y tế/nhân thọ (Rủi ro bất trắc) - Danh mục đầu tư đa dạng (Lạm phát và tương lai dài hạn)."
    }
,
  {
    title: "10 Nghề Nông Thôn Vốn Ít Kiếm Tiền Tỷ Năm 2026",
    category: "Chú béo gợi ý",
    outline: "Giới thiệu 10 mô hình kinh doanh nông nghiệp vốn ít (nuôi trùn quế, ong, dúi, nấm đông trùng hạ thảo, bán nông sản qua livestream...) sinh lời cao nhờ giải quyết nhu cầu thực tế và ít bị cạnh tranh. Tác giả nhấn mạnh thành công đòi hỏi sự kiên trì âm thầm, làm từ nhỏ đến lớn chứ không có lối tắt làm giàu nhanh."
  },
  {
    title: "10 Nghề Tay Trái kiếm 5-20 Triệu/Tháng Hot Nhất Năm 2026",
    category: "Chú béo gợi ý",
    outline: "Đề xuất 10 công việc làm thêm tại nhà không cần vốn, tập trung vào việc dùng AI để tăng hiệu suất (chỉnh sửa video, quản lý MXH, bán sản phẩm số, nhập liệu, affiliate marketing, viết blog SEO). Lời khuyên là hãy chọn một nghề và làm đều đặn ít nhất 90 ngày để thấy được kết quả tài chính."
  },
  {
    title: "10 Nguyên Tắc Tài Chính Giúp Người DO THÁI Luôn Giàu Có",
    category: "Chú béo gợi ý",
    outline: "Đúc kết các tư duy cốt lõi của người Do Thái: đầu tư vào giáo dục, tạo giá trị trước khi đòi tiền, bắt tiền làm việc, và xây dựng mạng lưới quan hệ. Họ sống dưới mức thu nhập, luôn đa dạng hóa tài sản, coi từ thiện là nghĩa vụ và có tư duy tài chính xuyên thế hệ."
  },
  {
    title: "10 Thói Quen Tẻ Nhạt Của Người Giàu Thầm Lặng Giúp Họ Tích Lũy Tiền Tỷ",
    category: "Chú béo gợi ý",
    outline: "Phân tích những thói quen bình dị nhưng tạo ra tài sản lớn như: không chi tiêu để gây ấn tượng, tự động hóa tài chính, sống dưới mức thu nhập, và quyết định chậm với số tiền lớn. Người giàu thực sự mua sự tự do chứ không mua hình ảnh hào nhoáng bề ngoài."
  },
  {
    title: "10 Thứ Đáng Mua Nhất Năm 2026",
    category: "Chú béo gợi ý",
    outline: "Gợi ý các khoản chi mang lại giá trị dài hạn: thiết lập tài khoản đầu tư tự động, bảo hiểm sức khỏe, khóa học AI thực chiến, thiết bị tăng năng suất, học nấu ăn, tài nguyên học tập, và thói quen vận động. Điểm chung của những thứ này là giá trị luôn tăng lên theo thời gian, khác với tiêu sản mất giá ngay khi mua."
  },
  {
    title: "10 Điều Tôi Ước Mình Biết Về Tiền Từ Năm 20 Tuổi",
    category: "Chú béo gợi ý",
    outline: "Chia sẻ các bài học tài chính sống còn cho người trẻ: lương chỉ là nguyên liệu thô, tầm quan trọng của quỹ khẩn cấp, sự tàn phá của nợ thẻ tín dụng lãi cao, và việc tránh mua xe mới sớm. Tác giả khuyên nên áp dụng nguyên tắc \"tiết kiệm trước, tiêu sau\" bằng hệ thống tự động để chống lại bản năng chi tiêu."
  },
  {
    title: "5 Cách Người Giàu Dùng AI Kiếm Tiền: Bạn Đang Giải Trí Hay Tạo Ra Giá Trị?",
    category: "Chú béo gợi ý",
    outline: "Hướng dẫn tận dụng AI để khuếch đại năng suất: tự động hóa quy trình kinh doanh, nhân rộng nội dung chuyên môn, xây dựng sản phẩm số, tăng tốc học tập, và vượt rào cản ngôn ngữ mở rộng thị trường. AI là công cụ đòn bẩy khuếch đại năng lực sẵn có, không phải phép màu tạo tiền từ không khí."
  },
  {
    title: "6 Khoản CHI TIÊU Ai Cũng Gọi Là Đầu Tư Nhưng Thực Ra Là Lãng Phí",
    category: "Chú béo gợi ý",
    outline: "Vạch trần tâm lý tự biện hộ khi gán mác \"đầu tư\" cho các khoản tiêu xài: mua đồ công nghệ đắt tiền, mua khóa học nhưng không học, đăng ký thẻ gym bỏ xó, mua đồ hàng hiệu, hoặc đi du lịch sang chảnh vượt khả năng. Cần phân biệt rạch ròi đâu là đầu tư sinh lời thực sự, đâu là tiêu xài cảm xúc."
  },
  {
    title: "7 Công Việc Làm Thêm Cho Sinh Viên Kiếm 5 tới 20 Triệu/Tháng năm 2026",
    category: "Chú béo gợi ý",
    outline: "Giới thiệu các công việc tự do linh hoạt: gia sư online, viết content freelance, làm affiliate TikTok, chạy quảng cáo, dịch thuật, xây kênh nội dung, và thiết kế đồ họa. Giá trị lớn nhất không chỉ là tiền mà là việc học được kỹ năng tự tìm khách hàng và quản lý thời gian."
  },
  {
    title: "7 Mô Hình Kinh Doanh Bạn Có Thể Bắt Đầu Với Dưới 50 Triệu",
    category: "Chú béo gợi ý",
    outline: "Gợi ý các hướng đi vốn nhỏ, rủi ro thấp: bán hàng online theo ngách, dịch vụ vệ sinh nhà cửa, dropshipping, mô hình thuê và cho thuê lại phòng trọ, quán ăn sáng nhỏ, và làm trung gian sửa chữa. Lời khuyên là hãy bắt đầu từ quy mô nhỏ và thử nghiệm nhanh thay vì chờ đợi hoàn cảnh hoàn hảo."
  },
  {
    title: "7 Sai Lầm Đầu Tư Nguy Hiểm Nhất: Nhiều Người Mất Cả Tỷ Đồng Vì Điều Này",
    category: "Chú béo gợi ý",
    outline: "Cảnh báo các bẫy như: đầu tư vì sợ lỡ cơ hội (FOMO), thiếu nền tảng quỹ khẩn cấp, mua theo phím hàng, hiểu sai về đa dạng hóa, và không kiểm soát được tâm lý. Để thành công, nhà đầu tư cần lập chiến lược rõ ràng thay vì chỉ chăm chăm đi tìm mua cổ phiếu."
  },
  {
    title: "7 Thứ Người Giàu Thực Sự Không Bao Giờ Mua",
    category: "Chú béo gợi ý",
    outline: "Chỉ ra rằng người giàu không mua: xe mới trả góp vượt khả năng, đồ vật chỉ để gây ấn tượng, dịch vụ đăng ký không sử dụng, thức ăn theo cảm xúc, sản phẩm tài chính phức tạp không hiểu rõ, và tiêu tốn thời gian cá nhân vào việc kém hiệu quả. Họ chi tiêu dựa trên giá trị và chi phí cơ hội thực tế."
  },
  {
    title: "7 Tài Sản Giá Trị Hơn Cả Tiền Bạc Bạn Cần Xây Dựng Trước Tuổi 40",
    category: "Chú béo gợi ý",
    outline: "Nhấn mạnh tầm quan trọng của 7 nền tảng: sức khỏe, tư duy và kỹ năng, mạng lưới quan hệ chất lượng, danh tiếng, các mối quan hệ gia đình/bạn bè thân thiết, tự do tài chính cơ sở (không nợ xấu), và sự rõ ràng về mục đích sống. Thiếu hụt bất kỳ yếu tố nào cũng sẽ tạo ra sự mất cân bằng lớn."
  },
  {
    title: "8 Nghề Văn Phòng Sắp Bị AI Xóa Sổ: Bạn Có Nằm Trong Danh Sách Này?",
    category: "Chú béo gợi ý",
    outline: "Cảnh báo 8 công việc lặp đi lặp lại dễ bị AI thay thế: kế toán nhập liệu, lập trình viên cấp thấp, nhân viên CSKH, data analyst cơ bản, HR phổ thông, content creator chạy số lượng, trợ lý pháp lý, và biên phiên dịch cấp thấp. Cách duy nhất để tồn tại là học cách điều khiển AI và tập trung vào các kỹ năng tư duy phản biện, sáng tạo."
  },
  {
    title: "Bán Hàng Online 2026: Cơ Hội Làm Giàu Hay Cái Bẫy Trắng Tay?",
    category: "Chú béo gợi ý",
    outline: "Phân tích rủi ro khi bán hàng trên sàn: rào cản thấp tạo ra cạnh tranh khốc liệt, sự phụ thuộc hoàn toàn vào thuật toán, quản trị dòng tiền yếu kém, và rủi ro pháp lý/thuế thay đổi. Người bán cần có chiến lược quản lý rủi ro và đa dạng hóa kênh bán hàng để tồn tại lâu dài."
  },
  {
    title: "Bẫy Tháng Nào Tiêu Hết Tháng Đó: Đây Là Lý Do Người Lương 30 Triệu Vẫn Không Có Tiền?",
    category: "Chú béo gợi ý",
    outline: "Giải mã việc cạn tiền dù thu nhập cao là do: \"sự thích nghi khoái lạc\" (lạm phát lối sống), áp lực đồng trang lứa, và \"kế toán tinh thần\" lệch lạc khiến tiền thưởng bay nhanh. Để thoát bẫy, cần thiết lập lệnh tiết kiệm tự động (trả cho mình trước) và nhận diện đúng các \"trigger\" kích hoạt chi tiêu."
  },
  {
    title: "Càng Giàu Càng Dám Chi 7 Khoản Tiền Này, Bạn Có Đang Bỏ Qua?",
    category: "Chú béo gợi ý",
    outline: "Phân tích tư duy chi tiêu tạo giá trị dài hạn: người giàu sẵn sàng bỏ tiền mua thời gian của người khác, mua thông tin chuyên nghiệp, bảo vệ rủi ro (bảo hiểm), mua đồ chất lượng thay vì số lượng, đầu tư vào môi trường tốt, và \"mua\" sự kiên nhẫn chờ đợi."
  },
  {
    title: "Có 500 Triệu Nên Đầu Tư Gì? 6 Việc Cần Làm Ngay Để Tiền Sinh Lời",
    category: "Chú béo gợi ý",
    outline: "Hướng dẫn 6 bước thực chiến: dừng lại 30 ngày để cảm xúc nguội đi, rà soát lại bức tranh tài chính (trả hết nợ xấu), xây quỹ khẩn cấp 6-12 tháng, phân bổ tiền theo mốc thời gian (ngắn, trung, dài hạn), đầu tư vào kỹ năng bản thân, và thiết lập hệ thống tiết kiệm tự động."
  },
  {
    title: "Hướng Dẫn Từ A Đến Z Kinh Doanh Mùa World Cup Cho Người Vốn Nhỏ",
    category: "Chú béo gợi ý",
    outline: "Phân tích cơ hội kinh doanh đồ ăn đêm mùa bóng đá. Đưa ra dự toán vốn, gợi ý 10 mặt hàng có biên lợi nhuận cao (bia, đồ nướng, đồ ăn vặt) và chiến lược marketing chi phí thấp. Cảnh báo về rủi ro thời tiết, sức khỏe và các chi phí điện/gas ẩn."
  },
  {
    title: "Làm Gì Khi Bạn Bè Đều Đã Giàu?",
    category: "Chú béo gợi ý",
    outline: "Mổ xẻ áp lực đồng trang lứa trên mạng xã hội và \"ảo giác về sự giàu có\" của người khác. Hướng dẫn cách tạo bảng điểm tài chính riêng, tự so sánh với chính mình trong quá khứ thay vì lao vào chạy đua vay nợ để \"sống ảo\" cho bằng bạn bằng bè."
  },
  {
    title: "Làn Sóng Bỏ Việc Văn Phòng: Tại Sao Người Trẻ Việt Nam Đang Từ Chối Công Việc Ổn Định?",
    category: "Chú béo gợi ý",
    outline: "Lý giải xu hướng nghỉ việc: định nghĩa về \"ổn định\" đã lỗi thời, khoảng cách giữa kỳ vọng và lương thực tế, khủng hoảng ý nghĩa công việc, cơ hội mới từ kinh tế số, và sự thay đổi thước đo thành công. Cảnh báo không nên bỏ việc bốc đồng khi chưa có dự phòng tài chính ít nhất 6 tháng."
  },
  {
    title: "LẠM PHÁT 2026: 5 TÀI SẢN Nên Sở Hữu Ngay Để TIỀN Không Bị Mất Giá",
    category: "Chú béo gợi ý",
    outline: "Giới thiệu 5 nhóm tài sản phòng vệ lạm phát hiệu quả: Vàng (tăng giá nhưng không có dòng tiền), Bất động sản có dòng tiền thực, Cổ phần doanh nghiệp có khả năng định giá, Tài sản liên quan ngoại tệ mạnh, và quan trọng nhất là năng lực tạo thu nhập của chính bản thân."
  },
  {
    title: "Lộ Trình Tự Do Tài Chính Ở Tuổi 40 Từ A Đến Z",
    category: "Chú béo gợi ý",
    outline: "Vạch ra 5 giai đoạn: xây nền tảng (xóa nợ), tạo đà (tích lũy 300-500 triệu), tăng tốc nhờ lãi kép, hoàn thiện mục tiêu 25 lần chi tiêu năm, và đạt tự do. Lộ trình đòi hỏi kỷ luật tiết kiệm 25-35% thu nhập liên tục trong 15 năm thay vì phụ thuộc vào may rủi."
  },
  {
    title: "Mua Xe Trả Góp Hay Mua Đứt? Tôi Đã Tính Ra Con Số Thật",
    category: "Chú béo gợi ý",
    outline: "Phân tích rủi ro của lãi suất thả nổi khi mua xe trả góp và chi phí cơ hội bị mất đi khi mua đứt. Vạch trần \"chi phí nuôi xe\" (khoảng 5-6 triệu/tháng) cộng thêm khoản khấu hao vô hình. Khuyên tỷ lệ trả góp và nuôi xe không nên vượt quá 50% thu nhập hàng tháng."
  },
  {
    title: "Mua Ô Tô Hay Tiếp Tục Đi Xe Máy? Hãy Xem Điều Này Trước Khi Quyết Định",
    category: "Chú béo gợi ý",
    outline: "So sánh chi tiết tổng chi phí sở hữu xe máy (khoảng 1 triệu/tháng) và ô tô (từ 9-11 triệu/tháng). Khuyến nghị chỉ mua ô tô khi tổng chi phí không vượt quá 25% thu nhập, đã có quỹ dự phòng an toàn, và có nhu cầu thiết yếu không thể thay thế."
  },
  {
    title: "Muốn Nhân Đôi Tài Sản Trước Tuổi 35? Đây Là Cách An Toàn Nhất",
    category: "Chú béo gợi ý",
    outline: "Áp dụng \"Quy tắc 72\" để tính tốc độ nhân đôi tài sản. Lộ trình tập trung vào 3 đòn bẩy: tỷ lệ tiết kiệm (25-40%), lợi suất đầu tư (8-12%), và gia tăng thu nhập. Yêu cầu thiết lập \"máy tiết kiệm tự động\" và phân bổ danh mục đầu tư theo từng giai đoạn tuổi."
  },
  {
    title: "Muốn có dòng tiền 10 triệu/tháng, cần bao nhiêu vốn?",
    category: "Chú béo gợi ý",
    outline: "Tính toán vốn cần thiết cho từng kênh: Gửi tiết kiệm cần 1-2 tỷ (an toàn nhưng sợ lạm phát), Quỹ trái phiếu cần 1-1,5 tỷ, Bất động sản cho thuê cần 3-5 tỷ, và Quỹ cổ phiếu cần khoảng 3 tỷ (áp dụng quy tắc rút 4%). Tác giả khuyên nên kết hợp đa dạng các kênh để chống lạm phát và tối ưu rủi ro."
  },
  {
    title: "Sự Thật Về Lương Nhật Bản: Tại Sao Làm Cày Cuốc 3 Năm Vẫn Trắng Tay?",
    category: "Chú béo gợi ý",
    outline: "Bóc trần 7 nguyên nhân XKLĐ về tay trắng: Gánh nặng nợ đi xuất ngoại, tiền gửi về bị tiêu hết, sập bẫy chi tiêu ở cộng đồng người Việt, tỷ giá Yên suy giảm, và thiếu kế hoạch tài chính sau khi về nước. Nhấn mạnh tầm quan trọng của việc lập kế hoạch tiết kiệm ngay từ đầu."
  },
  {
    title: "Sự Thật Về Lương Xuất Khẩu Lao Động: Nên Đi NHẬT BẢN Hay HÀN QUỐC?",
    category: "Chú béo gợi ý",
    outline: "So sánh XKLĐ Nhật và Hàn: Hàn Quốc có mức lương thực tế cao hơn nhưng rủi ro lao động bất hợp pháp và cám dỗ chi tiêu mạnh; Nhật Bản có thu nhập thấp hơn do tỷ giá nhưng an toàn, kỷ luật và có cơ hội định cư (kỹ năng đặc định). Lời khuyên là hãy chọn dựa trên mục tiêu dài hạn của bản thân."
  },
  {
    title: "Sự Thật Về Ngành Bán Khóa Học Làm Giàu Online: Giáo Dục Hay Lùa Gà?",
    category: "Chú béo gợi ý",
    outline: "Bóc phốt mô hình bán khóa học: mượn hình ảnh ảo, thao túng nỗi sợ FOMO của khách hàng, và thu lợi nhuận khủng từ hệ thống affiliate (hoa hồng 20-50%) thay vì áp dụng kiến thức để đầu tư. Chỉ ra nghịch lý: người thực sự biết cách làm giàu sẽ không bán bí quyết đó với giá vài triệu."
  },
  {
    title: "Tại Sao Bố Mẹ Mua Được Nhà Còn Bạn Thì Không?",
    category: "Chú béo gợi ý",
    outline: "Giải mã 6 lý do thế hệ 9x khó mua nhà: Giá nhà tăng phi mã, lạm phát lối sống đô thị, gánh nặng nợ trả góp tiêu dùng, thiếu kiến thức tài chính cơ bản, và bỏ lỡ sức mạnh lãi kép do đầu tư quá muộn. Khuyên người trẻ cần tìm các kênh tích lũy tài sản mới cho hợp thời đại."
  },
  {
    title: "Vì Sao 80% Quán Cà Phê Đóng Cửa Chỉ Sau 1 Năm?",
    category: "Chú béo gợi ý",
    outline: "Chỉ ra 7 nguyên nhân thất bại: Nhầm lẫn giữa sở thích uống cà phê và kỹ năng kinh doanh, đánh giá sai chi phí vận hành, chọn sai vị trí mặt bằng, khủng hoảng nhân sự, thị trường bão hòa, thiếu quỹ dự phòng duy trì quán, và ảo tưởng về thu nhập thụ động."
  },
  {
    title: "Vì Sao BÁN ĐẤT Bây Giờ Rất Khó? Cắt Lỗ Cũng Không Ai Mua",
    category: "Chú béo gợi ý",
    outline: "Lý giải sự đóng băng của đất nền: Nhà đầu tư sử dụng đòn bẩy quá mức lúc sốt đất, pháp lý siết chặt phân lô bán nền, tâm lý chờ bắt đáy lan rộng, hạ tầng chậm tiến độ, và dòng tiền dịch chuyển sang chứng khoán, vàng."
  },
  {
    title: "Vì Sao Bạn Luôn ĐU ĐỈNH Trong Mọi Cơn Sốt ĐẤT và CHỨNG KHOÁN?",
    category: "Chú béo gợi ý",
    outline: "Giải thích bẫy FOMO trong đầu tư: Bản năng chạy theo đám đông, vị trí của nhà đầu tư cá nhân luôn nằm cuối dòng chảy thông tin, thiên kiến xác nhận, thiếu vốn nhàn rỗi, và sự lấn át của nỗi sợ bị bỏ lỡ đúng vào lúc rủi ro đạt đỉnh."
  },
  {
    title: "Vì Sao Cơn Sốt Vàng Đang Nguội Lạnh Trong Âm Thầm?",
    category: "Chú béo gợi ý",
    outline: "Phân tích đà giảm nhiệt của vàng nhẫn: Người mua lúc giá đỉnh đang bị kẹt vốn, chênh lệch giá mua-bán quá lớn làm mất lợi nhuận, chính sách quản lý nhà nước dự kiến thay đổi gây tâm lý e dè, và dòng tiền dần chuyển dịch sang kênh tiết kiệm hoặc chứng khoán."
  },
  {
    title: "Vì Sao Giá Chung Cư Giảm? Cắt Lỗ Vẫn Không Ai Mua",
    category: "Chú béo gợi ý",
    outline: "Giải thích nghịch lý thị trường chung cư: Áp lực trả lãi vay ép nhà đầu tư phải cắt lỗ, giá neo quá cao so với thu nhập của người ở thực, nguồn cung mới dồi dào, tâm lý người mua chờ giá giảm sâu hơn, và sự phân hóa thị trường (chỉ dự án kém chất lượng mới giảm)."
  },
  {
    title: "Vì Sao Hàng Loạt DU HỌC SINH Về Nước Thất Nghiệp? Chuyện Gì Đang Xảy Ra",
    category: "Chú béo gợi ý",
    outline: "Chỉ ra thực trạng của du học sinh về nước: Khoảng cách giữa lý thuyết và kỹ năng thực tiễn, sốc văn hóa ngược, và kỳ vọng mức lương quá cao để thu hồi vốn hàng tỷ đồng. Cảnh báo về góc khuất hoa hồng của ngành tư vấn du học."
  },
  {
    title: "Vì Sao Hàng Loạt Trung Tâm Tiếng Anh Đang Đóng Cửa?",
    category: "Chú béo gợi ý",
    outline: "Nêu 4 nguyên nhân khiến trung tâm Anh ngữ đóng cửa: Cạnh tranh gay gắt từ ứng dụng AI rẻ và linh hoạt, thị trường bão hòa bị siết chặt pháp lý, khủng hoảng niềm tin do các vụ ôm tiền học phí bỏ trốn, và hệ thống trường phổ thông đã tích hợp chương trình tiếng Anh tăng cường."
  },
  {
    title: "Vì Sao NGÂN HÀNG Sợ Những Khách Hàng Am Hiểu Tài Chính?",
    category: "Chú béo gợi ý",
    outline: "Bóc trần cách ngân hàng kiếm lời từ sự thiếu hiểu biết: Các loại phí ẩn phức tạp, bẫy lãi suất ưu đãi ngắn hạn chuyển sang thả nổi, ép bán chéo bảo hiểm liên kết đầu tư, và thẻ tín dụng kích thích chi tiêu vô thức. Khách hàng am hiểu sẽ biết cách đàm phán giảm biên lợi nhuận của ngân hàng."
  },
  {
    title: "Vì Sao NHÀ PHỐ Cho Thuê Tại Các Quận Trung Tâm Đang Bị Bỏ Trống Hàng Loạt?",
    category: "Chú béo gợi ý",
    outline: "Phân tích sự thất thế của nhà mặt tiền: Chủ nhà neo giá ảo theo giá trị tài sản thay vì khả năng sinh lời, hành vi mua sắm dịch chuyển lên online và trung tâm thương mại, chi phí vận hành độc lập đắt đỏ, và xu hướng thu hẹp quy mô của các doanh nghiệp bán lẻ."
  },
  {
    title: "Vì Sao Ngành IT Không Còn Là Vùng Đất Hứa Lương Nghìn Đô?",
    category: "Chú béo gợi ý",
    outline: "Giải mã sự chững lại của ngành công nghệ: AI (ChatGPT, Copilot) tự động hóa các tác vụ cơ bản thay thế Junior, mô hình công ty \"gia công\" sẵn sàng đào thải kỹ sư lớn tuổi, và sự ảnh hưởng từ làn sóng sa thải nhân sự toàn cầu. Lời khuyên là hãy học cách làm chủ AI."
  },
  {
    title: "Vì Sao Người Bán TikTok Shop, Shopee Đang Phá Sản Hàng Loạt? Và Cách Trụ Vững là gì?",
    category: "Chú béo gợi ý",
    outline: "Phân tích sức ép lên người bán TMĐT: Phí sàn tăng vọt lên tới 40-45%, cuộc đua giá rẻ chấm dứt, hàng Trung Quốc cạnh tranh trực tiếp qua nền tảng xuyên biên giới, mô hình bán ảnh tĩnh bị livestream/video đào thải, và thuế thu nhập bị siết chặt."
  },
  {
    title: "Vì Sao Người Giàu Không Sợ Thất Bại?",
    category: "Chú béo gợi ý",
    outline: "Vạch ra cơ chế tâm lý của người giàu: Họ có \"bảo vệ mức sàn\" (quỹ dự phòng), coi thất bại là bài học tín hiệu chứ không phải cảm xúc tồi tệ, tư duy cược bất cân xứng (thua ít, thắng nhiều), tách biệt danh tính cá nhân khỏi kết quả, và luôn duy trì nhiều lựa chọn dự phòng (optionality)."
  },
  {
    title: "Vì Sao Người Livestream Bán Hàng Đang Phá Sản Hàng Loạt?",
    category: "Chú béo gợi ý",
    outline: "Bóc tách \"ảo giác doanh thu\" trong livestream: 6 lớp chi phí thật (phí giao dịch, hoa hồng sàn, xử lý đơn, affiliate, quảng cáo, thuế) ngốn sạch biên lợi nhuận. Chi phí ẩn như tỷ lệ hoàn hàng (lên tới 25%) và hao mòn thiết bị/thời gian khiến người bán thực chất đang lỗ nặng."
  },
  {
    title: "Vì Sao Nhiều Người Việt Thà Chịu Khổ Ở Nhật Còn Hơn Về Nước?",
    category: "Chú béo gợi ý",
    outline: "Lý giải quyết định không về nước: Thu nhập và tỷ lệ tiết kiệm tại Nhật cao gấp 5-8 lần Việt Nam, môi trường làm việc minh bạch kỷ luật, hạ tầng dịch vụ tốt, và giúp né tránh được áp lực xã hội trong nước. Đánh đổi lại là sức khỏe bị bào mòn và sự cô đơn."
  },
  {
    title: "Vì Sao Tiết Kiệm 100 TRIỆU Đầu Tiên Lại Là Thử Thách Khó Nhất?",
    category: "Chú béo gợi ý",
    outline: "Phân tích \"bức tường 100 triệu\": Động lực cá nhân sụt giảm do tiến bộ mờ nhạt, cám dỗ chi tiêu mạnh mẽ, và ảo giác \"đã an toàn\" khiến kỷ luật bị lỏng lẻo. Lời khuyên là hãy vượt qua để lãi kép phát huy tác dụng và tránh mang đi so sánh tốc độ với người khác."
  },
  {
    title: "Vì Sao Trông Có Vẻ Giàu Lại Là Một Lợi Thế Rất Lớn Trong Cuộc Sống?",
    category: "Chú béo gợi ý",
    outline: "Giải thích \"Hiệu ứng hào quang\" (Halo Effect): Não bộ vô thức đánh giá người chỉn chu là người có năng lực và đáng tin cậy. Việc chăm chút ngoại hình mở ra cơ hội kinh doanh, vay vốn. Tác giả cảnh báo cần phân biệt rõ giữa sự gọn gàng khôn ngoan và lối sống vay nợ phô trương giả tạo."
  },
  {
    title: "Vì Sao Tài Xế Xe Ôm Công Nghệ Đang Nghỉ Việc Hàng Loạt?",
    category: "Chú béo gợi ý",
    outline: "Nêu 5 lý do xe ôm công nghệ bỏ nghề: Thị trường bão hòa chia nhỏ cuốc xe, chi phí ẩn (xăng, khấu hao) cao làm giảm thu nhập thực tế, không được công nhận là người lao động chính thức để hưởng bảo hiểm, áp lực tài chính chuyển đổi sang xe điện, và sự hao mòn sức khỏe trầm trọng."
  },
  {
    title: "Vốn 20 TRIỆU, Nên Kinh Doanh Online Gì? Hướng Dẫn Từ A tới Z",
    category: "Chú béo gợi ý",
    outline: "Đề xuất 5 ngách phù hợp: Đồ gia dụng thông minh nhỏ gọn, mỹ phẩm dung tích mini, phụ kiện thời trang theo trend (xoay vòng vốn nhanh), thực phẩm khô đóng gói, và sản phẩm số. Hướng dẫn chi tiết cách chia ngân sách để nhập mẫu thử, chạy quảng cáo, và luôn giữ quỹ dự phòng."
  },
  {
    title: "World Cup Và Tâm Lý Gỡ Gạc Kinh Điển Biến Dân Cá Độ Thành Con Nợ Trắng Tay",
    category: "Chú béo gợi ý",
    outline: "Giải mã bẫy \"đuổi theo tổn thất\" (Chasing Losses): Tâm lý sợ mất mát lớn hơn niềm vui chiến thắng, ảo tưởng \"sắp đến lượt mình thắng\", và kế toán tinh thần lệch lạc (coi tiền thua là tiền của nhà cái). Nhấn mạnh nhà cái luôn có lợi thế toán học (hoa hồng ẩn) nên người chơi cá độ luôn lỗ trong dài hạn."
  }
];
