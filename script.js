// ========================================
// 메뉴 데이터베이스
// ========================================

/**
 * 추천 가능한 모든 메뉴를 저장하는 배열
 * 각 메뉴는 이름, 카테고리, 기분별 점수를 포함합니다
 */
const menuDatabase = [
    // 한식 메뉴
    { name: '김치찌개', category: '한식', great: 8, good: 9, normal: 8, tired: 7, bad: 9 },
    { name: '된장찌개', category: '한식', great: 7, good: 8, normal: 9, tired: 8, bad: 8 },
    { name: '불고기', category: '한식', great: 10, good: 9, normal: 7, tired: 6, bad: 5 },
    { name: '비빔밥', category: '한식', great: 9, good: 10, normal: 9, tired: 7, bad: 6 },
    { name: '삼겹살', category: '한식', great: 10, good: 9, normal: 6, tired: 5, bad: 4 },
    { name: '갈비탕', category: '한식', great: 8, good: 8, normal: 7, tired: 9, bad: 8 },
    { name: '냉면', category: '한식', great: 9, good: 10, normal: 8, tired: 7, bad: 6 },

    // 중식 메뉴
    { name: '짜장면', category: '중식', great: 9, good: 10, normal: 10, tired: 8, bad: 9 },
    { name: '짬뽕', category: '중식', great: 8, good: 9, normal: 8, tired: 9, bad: 10 },
    { name: '탕수육', category: '중식', great: 10, good: 9, normal: 7, tired: 6, bad: 5 },
    { name: '볶음밥', category: '중식', great: 8, good: 9, normal: 9, tired: 8, bad: 7 },

    // 일식 메뉴
    { name: '초밥', category: '일식', great: 10, good: 9, normal: 8, tired: 7, bad: 6 },
    { name: '라멘', category: '일식', great: 9, good: 9, normal: 8, tired: 10, bad: 9 },
    { name: '돈카츠', category: '일식', great: 9, good: 10, normal: 8, tired: 7, bad: 6 },
    { name: '우동', category: '일식', great: 7, good: 8, normal: 9, tired: 9, bad: 8 },

    // 양식 메뉴
    { name: '파스타', category: '양식', great: 9, good: 10, normal: 8, tired: 6, bad: 5 },
    { name: '피자', category: '양식', great: 10, good: 10, normal: 9, tired: 7, bad: 8 },
    { name: '스테이크', category: '양식', great: 10, good: 9, normal: 7, tired: 6, bad: 4 },
    { name: '햄버거', category: '양식', great: 9, good: 9, normal: 10, tired: 8, bad: 9 },

    // 분식 메뉴
    { name: '떡볶이', category: '분식', great: 8, good: 9, normal: 10, tired: 7, bad: 8 },
    { name: '김밥', category: '분식', great: 7, good: 8, normal: 10, tired: 8, bad: 7 },
    { name: '라면', category: '분식', great: 7, good: 8, normal: 9, tired: 10, bad: 10 },
    { name: '순대', category: '분식', great: 7, good: 8, normal: 9, tired: 8, bad: 7 },

    // 기타 메뉴
    { name: '샐러드', category: '기타', great: 7, good: 8, normal: 7, tired: 5, bad: 4 },
    { name: '쌀국수', category: '기타', great: 8, good: 9, normal: 9, tired: 8, bad: 7 },
    { name: '치킨', category: '기타', great: 10, good: 10, normal: 9, tired: 8, bad: 9 },
];

// ========================================
// DOM 요소 가져오기
// ========================================

/**
 * HTML 요소들을 JavaScript 변수에 저장합니다
 * 이렇게 하면 나중에 쉽게 접근하고 조작할 수 있습니다
 */
const menuForm = document.getElementById('menuForm'); // 입력 폼
const resultCard = document.getElementById('resultCard'); // 결과 표시 영역
const recommendedMenu = document.getElementById('recommendedMenu'); // 추천 메뉴 이름
const recommendReason = document.getElementById('recommendReason'); // 추천 이유
const retryBtn = document.getElementById('retryBtn'); // 다시 추천받기 버튼

// ========================================
// 핵심 기능 함수들
// ========================================

/**
 * 최근에 먹은 음식과 비슷한지 확인하는 함수
 * @param {string} menuName - 확인할 메뉴 이름
 * @param {Array} recentFoods - 최근에 먹은 음식 목록
 * @returns {boolean} - 비슷하면 true, 아니면 false
 */
function isSimilarFood(menuName, recentFoods) {
    // 메뉴 이름을 소문자로 변환하여 비교 (대소문자 구분 없이)
    const menuLower = menuName.toLowerCase();

    // 최근에 먹은 음식 목록을 순회하면서 확인
    for (let food of recentFoods) {
        const foodLower = food.toLowerCase().trim();

        // 정확히 일치하는 경우
        if (menuLower === foodLower) {
            return true;
        }

        // 메뉴 이름에 최근 음식이 포함되어 있는 경우
        if (menuLower.includes(foodLower) || foodLower.includes(menuLower)) {
            return true;
        }

        // 카테고리가 같은 경우 (예: 짜장면과 짬뽕은 둘 다 중식)
        const menuCategory = menuDatabase.find(m => m.name === menuName)?.category;
        const foodCategory = menuDatabase.find(m => m.name === foodLower)?.category;
        if (menuCategory && foodCategory && menuCategory === foodCategory) {
            return true;
        }
    }

    return false;
}

/**
 * 기분에 따라 메뉴를 추천하는 핵심 함수
 * @param {string} mood - 사용자의 기분 ('great', 'good', 'normal', 'tired', 'bad')
 * @param {Array} recentFoods - 최근에 먹은 음식 목록
 * @returns {Object} - 추천 메뉴 정보 (이름과 이유)
 */
function recommendMenu(mood, recentFoods) {
    // 1단계: 최근에 먹지 않은 메뉴만 필터링
    const availableMenus = menuDatabase.filter(menu =>
        !isSimilarFood(menu.name, recentFoods)
    );

    // 만약 모든 메뉴를 최근에 먹었다면, 전체 메뉴에서 추천
    const menusToChoose = availableMenus.length > 0 ? availableMenus : menuDatabase;

    // 2단계: 기분에 따른 점수로 메뉴 정렬 (점수가 높은 순서대로)
    const sortedMenus = menusToChoose.sort((a, b) => b[mood] - a[mood]);

    // 3단계: 상위 5개 메뉴 중에서 무작위로 선택 (다양성 보장)
    const topMenus = sortedMenus.slice(0, 5);
    const selectedMenu = topMenus[Math.floor(Math.random() * topMenus.length)];

    // 4단계: 추천 이유 생성
    const reason = generateReason(mood, selectedMenu, recentFoods);

    return {
        name: selectedMenu.name,
        reason: reason
    };
}

/**
 * 추천 이유를 생성하는 함수
 * @param {string} mood - 사용자의 기분
 * @param {Object} menu - 선택된 메뉴 정보
 * @param {Array} recentFoods - 최근에 먹은 음식 목록
 * @returns {string} - 추천 이유 문장
 */
function generateReason(mood, menu, recentFoods) {
    // 기분별 메시지
    const moodMessages = {
        great: '기분이 아주 좋으시니 맛있는',
        good: '좋은 기분에 어울리는',
        normal: '평범한 하루에 딱 좋은',
        tired: '피곤할 때 기운을 북돋아줄',
        bad: '기분을 전환시켜줄'
    };

    // 카테고리별 설명
    const categoryMessages = {
        한식: '정겨운 한식',
        중식: '든든한 중식',
        일식: '깔끔한 일식',
        양식: '풍미 가득한 양식',
        분식: '간편한 분식',
        기타: '특별한'
    };

    // 최근 음식을 피했다는 메시지 추가 여부
    let avoidMessage = '';
    if (recentFoods.length > 0) {
        avoidMessage = ` 최근에 드신 ${recentFoods.slice(0, 2).join(', ')}와는 다른 메뉴로 골라봤어요.`;
    }

    return `${moodMessages[mood]} ${categoryMessages[menu.category]} 메뉴를 추천드려요!${avoidMessage} 오늘 점심으로 딱이에요!`;
}

// ========================================
// 이벤트 처리 함수들
// ========================================

/**
 * 폼 제출 시 실행되는 함수
 * @param {Event} event - 폼 제출 이벤트
 */
function handleFormSubmit(event) {
    // 폼의 기본 동작(페이지 새로고침) 방지
    event.preventDefault();

    // 1단계: 사용자 입력값 가져오기
    const mood = document.getElementById('mood').value;
    const recentFoodInput = document.getElementById('recentFood').value;

    // 2단계: 최근 음식을 쉼표로 분리하여 배열로 만들기
    const recentFoods = recentFoodInput
        .split(',')
        .map(food => food.trim())
        .filter(food => food.length > 0);

    // 3단계: 메뉴 추천 받기
    const recommendation = recommendMenu(mood, recentFoods);

    // 4단계: 결과 표시
    displayResult(recommendation);
}

/**
 * 추천 결과를 화면에 표시하는 함수
 * @param {Object} recommendation - 추천 메뉴 정보
 */
function displayResult(recommendation) {
    // 추천 메뉴 이름 표시
    recommendedMenu.textContent = recommendation.name;

    // 추천 이유 표시
    recommendReason.textContent = recommendation.reason;

    // 결과 카드를 보이게 만들기
    resultCard.classList.remove('hidden');

    // 결과 카드로 부드럽게 스크롤
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 다시 추천받기 버튼 클릭 시 실행되는 함수
 */
function handleRetry() {
    // 결과 카드 숨기기
    resultCard.classList.add('hidden');

    // 폼의 맨 위로 부드럽게 스크롤
    menuForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========================================
// 이벤트 리스너 등록
// ========================================

/**
 * 폼 제출 이벤트 리스너
 * 사용자가 "점심 메뉴 추천받기" 버튼을 클릭하면 실행됩니다
 */
menuForm.addEventListener('submit', handleFormSubmit);

/**
 * 다시 추천받기 버튼 클릭 이벤트 리스너
 * 사용자가 "다시 추천받기" 버튼을 클릭하면 실행됩니다
 */
retryBtn.addEventListener('click', handleRetry);

// ========================================
// 페이지 로드 완료 메시지
// ========================================

/**
 * 페이지가 완전히 로드되면 콘솔에 메시지를 출력합니다
 * (개발자 도구에서 확인 가능)
 */
console.log('점심 메뉴 추천 앱이 준비되었습니다! 🍽️');
