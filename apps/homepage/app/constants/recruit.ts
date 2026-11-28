/**
 * 채용 페이지 콘텐츠.
 *
 * 자격 요건·급여 같은 조건은 운영하면서 자주 바뀌는 값이라
 * 페이지 컴포넌트에서 분리해 한 곳에서 고칠 수 있게 둔다.
 * 포지션이 늘어나면 RECRUIT_POSITIONS에 항목만 추가하면 된다.
 */

export const RECRUIT_EMAIL = "contact@youthfinlab.com";

/** 제목을 미리 채워 접수 메일의 형식을 통일한다. */
export const RECRUIT_MAILTO = `mailto:${RECRUIT_EMAIL}?subject=${encodeURIComponent(
  "[지원] 포지션 / 성함"
)}`;

interface RecruitTask {
  title: string;
  description: string;
}

interface RecruitRequirement {
  title: string;
  /** 자격증처럼 예시가 필요한 항목에만 붙인다. */
  note?: string;
}

interface RecruitCondition {
  label: string;
  value: string;
}

interface RecruitBenefitGroup {
  label: string;
  items: string[];
}

interface RecruitTool {
  name: string;
  usage: string;
}

export interface RecruitPosition {
  /** 개요 카드에서 상세 블록으로 이동하는 앵커 */
  id: string;
  name: string;
  employment: string;
  summary: string;
  tasks: RecruitTask[];
  /** 강사는 강의만 맡아 해당 없다. 협업 도구를 쓰는 포지션에만 붙인다. */
  tools?: RecruitTool[];
  requirements: RecruitRequirement[];
  preferred: string[];
  conditions: RecruitCondition[];
  /** 프리랜서 위촉인 강사에는 해당 없어 선택 항목으로 둔다. */
  benefits?: RecruitBenefitGroup[];
}

const INSTRUCTOR: RecruitPosition = {
  id: "instructor",
  name: "금융교육 전문강사",
  employment: "프리랜서 위촉",
  summary: "전국의 복지기관·학교·지자체·기업 현장에서 금융교육을 진행합니다.",
  tasks: [
    {
      title: "현장 금융교육 진행",
      description:
        "복지기관, 학교, 지자체, 기업 등 협력기관에 방문하여 금융교육을 진행합니다.",
    },
    {
      title: "대상별 맞춤 강의 설계",
      description:
        "청소년·학생부터 청년·사회초년생, 일반 성인까지 교육 대상에 맞는 강의를 설계합니다.",
    },
    {
      title: "모의투자 체험 프로그램 운영",
      description:
        "이론에 그치지 않고 직접 경험하는 실습형 프로그램을 함께 운영합니다.",
    },
    {
      title: "교육 결과 정리 및 공유",
      description:
        "교육 종료 후 진행 내용을 정리하고 현장의 피드백을 공유합니다.",
    },
  ],
  requirements: [
    {
      title: "금융 관련 자격증 보유",
      note: "투자자산운용사, 펀드·증권투자권유자문인력, AFPK·CFP, 은행FP 등",
    },
    { title: "금융·경제 분야 강의 경력 보유" },
    { title: "교육 대상의 눈높이에 맞춰 소통할 수 있는 분" },
  ],
  preferred: [
    "청소년·청년 대상 강의 경험이 있는 분",
    "금융기관 실무 경력이 있는 분",
    "평생교육사, 청소년지도사 자격 보유자",
    "경제·경영·교육학 전공자",
  ],
  conditions: [
    { label: "고용 형태", value: "프리랜서 위촉" },
    { label: "활동 지역", value: "전국 (거주지 인근 우선 배정)" },
    { label: "강사료", value: "교육 대상·시간·지역에 따라 협의 후 결정" },
    {
      label: "교육 대상",
      value: "청소년·학생 / 청년·사회초년생 / 일반·기관·기업",
    },
  ],
};

const EDUCATION_PM: RecruitPosition = {
  id: "education-pm",
  name: "교육 프로젝트 매니저 (PM)",
  employment: "정규직 · 주 4일 · 재택근무",
  summary:
    "교육 문의 접수부터 결과 보고까지, 교육 프로젝트 전 과정을 총괄합니다.",
  tasks: [
    {
      title: "교육 프로젝트 총괄",
      description:
        "교육 문의 접수부터 종료까지 일정과 리소스를 관리하며 프로젝트를 이끕니다.",
    },
    {
      title: "협력기관 커뮤니케이션",
      description:
        "기관 담당자와 협의하여 요구사항을 파악하고 맞춤 커리큘럼을 제안합니다.",
    },
    {
      title: "교육 현장 운영",
      description:
        "교육 당일 현장에 함께하며 진행 상황과 교구·기자재를 관리합니다.",
    },
    {
      title: "강사 매칭 및 일정 조율",
      description:
        "교육 성격에 맞는 강사를 배정하고 일정과 진행 방식을 조율합니다.",
    },
    {
      title: "결과 보고서 작성",
      description:
        "교육 결과와 만족도를 정리하여 기관에 전달할 보고서를 작성합니다.",
    },
    {
      title: "제안서 및 산출물 관리",
      description:
        "교육 제안서와 운영 문서를 작성하고 프로젝트 기록을 관리합니다.",
    },
  ],
  tools: [
    { name: "Notion", usage: "교육 프로젝트 문서와 진행 현황 관리" },
    { name: "Slack", usage: "팀 커뮤니케이션과 문의 알림 확인" },
    { name: "Google Sheets", usage: "교육 일정과 강사 배정 관리" },
  ],
  requirements: [
    { title: "교육·행사 운영 또는 프로젝트 관리 경력 보유" },
    { title: "기관·기업 담당자와 소통해본 경험이 있는 분" },
    {
      title: "문서 작성 능력을 갖추신 분",
      note: "제안서, 결과보고서 등 대외 문서 작성",
    },
    { title: "교육 현장 출장이 가능한 분" },
  ],
  preferred: [
    "교육업·에듀테크 분야 경력이 있는 분",
    "공공기관 사업을 수행해본 경험이 있는 분",
    "금융·경제 분야에 대한 이해가 있는 분",
    "협업 도구를 능숙하게 다루시는 분",
  ],
  conditions: [
    { label: "고용 형태", value: "정규직" },
    { label: "근무 형태", value: "재택근무 (교육 일정에 따라 전국 현장 출장)" },
    { label: "급여", value: "경력에 따라 협의 후 결정" },
    { label: "근무 일수", value: "주 4일 (교육 일정에 따라 조정)" },
  ],
  benefits: [
    {
      label: "근무 환경",
      items: [
        "완전 재택근무 — 거주 지역 제한 없음",
        "교육 일정에 맞춘 유연한 근무 시간",
        "노트북 등 업무 장비 지원",
      ],
    },
    {
      label: "성장 지원",
      items: [
        "금융 관련 자격증 취득 지원 (응시료·교재비)",
        "도서 구입 및 외부 교육·컨퍼런스 참가 지원",
        "사내 금융교육 프로그램 수강",
      ],
    },
    {
      label: "생활 지원",
      items: [
        "출장 교통비·식비 실비 지원",
        "임직원 재무상담 제공",
        "경조사비 및 경조 휴가",
      ],
    },
  ],
};

export const RECRUIT_POSITIONS: RecruitPosition[] = [INSTRUCTOR, EDUCATION_PM];

interface RecruitFaq {
  question: string;
  answer: string;
}

export const RECRUIT_FAQ: RecruitFaq[] = [
  {
    question: "강사료와 급여는 어떻게 책정되나요?",
    answer:
      "강사는 교육 대상, 교육 시간, 활동 지역 등을 종합적으로 고려하여 협의 후 결정합니다. 교육 프로젝트 매니저는 보유하신 경력을 기준으로 협의 후 결정합니다.",
  },
  {
    question: "지역 제한이 있나요?",
    answer:
      "강사는 전국에서 활동하실 수 있으며, 거주하시는 지역 인근의 교육을 우선 배정해드립니다. 교육 프로젝트 매니저는 재택근무를 기본으로 하며, 교육 일정에 맞춰 전국 현장에 출장이 있습니다.",
  },
  {
    question: "두 포지션에 모두 지원할 수 있나요?",
    answer:
      "가능합니다. 지원하시는 포지션을 메일 제목에 함께 적어 보내주시면 각각 검토하여 안내드립니다.",
  },
  {
    question: "지원 후 언제 연락받을 수 있나요?",
    answer:
      "보내주신 서류를 검토한 뒤 개별적으로 연락드립니다. 당장 매칭되는 교육이나 포지션이 없더라도 인재풀에 보관되어, 이후 진행 시 연락드릴 수 있습니다.",
  },
];
