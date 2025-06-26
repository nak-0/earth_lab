// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function () {
  // 초기화
  initializeApp();

  // 이벤트 리스너 등록
  setupEventListeners();

  // 로컬 스토리지에서 체크리스트 상태 복원
  loadChecklistState();

  // 진행률 업데이트
  updateProgress();
});

// 앱 초기화
function initializeApp() {
  console.log('🌱 지구를 지키는 체크리스트 앱이 시작되었습니다!');

  // 스크롤 애니메이션 설정
  setupScrollAnimations();

  // 네비게이션 활성 상태 설정
  setupNavigation();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 카테고리 버튼 클릭 이벤트
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const category = this.getAttribute('data-category');
      switchCategory(category);
    });
  });

  // 체크박스 변경 이벤트
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      saveChecklistState();
      updateProgress();
      showCompletionMessage();
    });
  });

  // 스크롤 이벤트
  window.addEventListener('scroll', function () {
    updateNavigationOnScroll();
  });
}

// 카테고리 전환
function switchCategory(category) {
  // 모든 카테고리 버튼 비활성화
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // 모든 카테고리 콘텐츠 숨기기
  document.querySelectorAll('.checklist-category').forEach(cat => {
    cat.classList.remove('active');
  });

  // 선택된 카테고리 활성화
  document.querySelector(`[data-category="${category}"]`).classList.add('active');
  document.getElementById(category).classList.add('active');

  // 부드러운 애니메이션 효과
  const activeCategory = document.getElementById(category);
  activeCategory.style.opacity = '0';
  setTimeout(() => {
    activeCategory.style.opacity = '1';
  }, 50);
}

// 진행률 업데이트
function updateProgress() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const progressPercentage = Math.round((checkedBoxes.length / checkboxes.length) * 100);

  // 진행률 텍스트 업데이트
  document.querySelector('.progress-percentage').textContent = `${progressPercentage}%`;

  // 진행률 바 업데이트
  const progressFill = document.querySelector('.progress-fill');
  progressFill.style.width = `${progressPercentage}%`;

  // 진행률에 따른 색상 변경
  if (progressPercentage >= 80) {
    progressFill.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
  } else if (progressPercentage >= 50) {
    progressFill.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
  } else {
    progressFill.style.background = 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)';
  }

  // 완료 메시지 표시
  if (progressPercentage === 100) {
    showCompletionCelebration();
  }
}

// 완료 메시지 표시
function showCompletionMessage() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const totalCheckboxes = document.querySelectorAll('input[type="checkbox"]').length;

  if (checkboxes.length === totalCheckboxes) {
    // 축하 메시지 표시
    showCompletionCelebration();
  }
}

// 완료 축하 애니메이션
function showCompletionCelebration() {
  // 축하 메시지 생성
  const celebration = document.createElement('div');
  celebration.className = 'celebration-message';
  celebration.innerHTML = `
        <div class="celebration-content">
            <h2>🎉 축하합니다! 🎉</h2>
            <p>모든 환경 보호 체크리스트를 완료하셨습니다!</p>
            <p>당신의 작은 실천이 지구를 더 아름답게 만들고 있어요.</p>
            <button onclick="this.parentElement.parentElement.remove()">확인</button>
        </div>
    `;

  // 스타일 적용
  celebration.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.5s ease;
    `;

  celebration.querySelector('.celebration-content').style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        animation: scaleIn 0.5s ease;
    `;

  celebration.querySelector('button').style.cssText = `
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 500;
        margin-top: 1rem;
    `;

  document.body.appendChild(celebration);

  // 5초 후 자동 제거
  setTimeout(() => {
    if (celebration.parentElement) {
      celebration.remove();
    }
  }, 5000);
}

// 체크리스트 상태 저장
function saveChecklistState() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const state = {};

  checkboxes.forEach(checkbox => {
    state[checkbox.id] = checkbox.checked;
  });

  localStorage.setItem('checklistState', JSON.stringify(state));
}

// 체크리스트 상태 복원
function loadChecklistState() {
  const savedState = localStorage.getItem('checklistState');

  if (savedState) {
    const state = JSON.parse(savedState);

    Object.keys(state).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = state[id];
      }
    });
  }
}

// 체크리스트 초기화
function resetChecklist() {
  if (confirm('정말로 모든 체크리스트를 초기화하시겠습니까?')) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // 로컬 스토리지에서도 제거
    localStorage.removeItem('checklistState');

    // 진행률 업데이트
    updateProgress();

    // 초기화 완료 메시지
    showMessage('체크리스트가 초기화되었습니다! 🌱');
  }
}

// 메시지 표시
function showMessage(text) {
  const message = document.createElement('div');
  message.className = 'message';
  message.textContent = text;
  message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

// 스크롤 애니메이션 설정
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // 애니메이션 대상 요소들
  const animatedElements = document.querySelectorAll('.about-card, .tip-card, .checklist-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// 네비게이션 설정
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // 모든 링크 비활성화
      navLinks.forEach(l => l.classList.remove('active'));

      // 클릭된 링크 활성화
      this.classList.add('active');

      // 해당 섹션으로 스크롤
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// 스크롤에 따른 네비게이션 업데이트
function updateNavigationOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// 체크리스트로 스크롤
function scrollToChecklist() {
  const checklistSection = document.getElementById('checklist');
  checklistSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// 추가 CSS 애니메이션
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes scaleIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .celebration-message {
        backdrop-filter: blur(5px);
    }
    
    .celebration-content h2 {
        color: #4CAF50;
        margin-bottom: 1rem;
    }
    
    .celebration-content p {
        margin-bottom: 0.5rem;
        color: #666;
    }
`;

// 스타일 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 키보드 단축키
document.addEventListener('keydown', function (e) {
  // Ctrl + R: 체크리스트 초기화
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    resetChecklist();
  }

  // Ctrl + S: 상태 저장 (자동으로 저장되지만 사용자에게 알림)
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    showMessage('체크리스트 상태가 저장되었습니다! 💾');
  }
});

// 페이지 로드 완료 메시지
window.addEventListener('load', function () {
  setTimeout(() => {
    console.log('🌍 지구를 지키는 체크리스트가 준비되었습니다!');
    console.log('💡 팁: Ctrl+R로 체크리스트를 초기화할 수 있습니다.');
  }, 1000);
}); 