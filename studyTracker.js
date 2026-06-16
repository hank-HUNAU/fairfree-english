// Study Tracker - 自动记录学习进度到打卡系统
// 在每个学习页面引入此脚本

(function() {
  const STORAGE_KEY = 'miningEnglishCheckin';
  
  // 从URL解析当前单元和模块
  function parseCurrentPage() {
    const path = window.location.pathname;
    const match = path.match(/Unit(\d+)\/Unit(\d+)_(.+)\.html/);
    if (match) {
      return {
        unit: parseInt(match[1]),
        module: match[3] // 词汇表, 精读材料, 情境会话, 句型汇总
      };
    }
    return null;
  }
  
  // 模块名称映射
  const moduleMap = {
    '词汇表': 'vocab',
    '精读材料': 'reading',
    '情境会话': 'dialogue',
    '句型汇总': 'sentences'
  };
  
  // 加载打卡数据
  function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      name: '',
      dept: '',
      startDate: null,
      totalDays: 0,
      totalMinutes: 0,
      dailyLog: [],
      unitProgress: {}
    };
  }
  
  // 保存打卡数据
  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  
  // 记录模块完成
  function markModuleComplete(unit, moduleName) {
    const data = loadData();
    const key = moduleMap[moduleName];
    if (!key) return;
    
    if (!data.unitProgress[unit]) {
      data.unitProgress[unit] = { vocab: false, reading: false, dialogue: false, sentences: false };
    }
    
    data.unitProgress[unit][key] = true;
    saveData(data);
    
    console.log(`[StudyTracker] Unit ${unit} - ${moduleName} marked complete`);
    
    // 显示完成提示
    showCompleteToast(unit, moduleName);
  }
  
  // 显示完成提示
  function showCompleteToast(unit, moduleName) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: #30d158;
      color: #fff;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      z-index: 9999;
      animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = `✓ Unit ${unit} ${moduleName} 已完成`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
  
  // 添加完成按钮到页面底部
  function addCompleteButton() {
    const page = parseCurrentPage();
    if (!page) return;
    
    const btn = document.createElement('button');
    btn.id = 'studyCompleteBtn';
    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #30d158;
      color: #fff;
      border: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(48, 209, 88, 0.3);
      transition: all 0.2s;
    `;
    btn.textContent = '✓ 完成学习';
    btn.onmouseenter = () => btn.style.transform = 'translateX(-50%) scale(1.05)';
    btn.onmouseleave = () => btn.style.transform = 'translateX(-50%) scale(1)';
    
    btn.onclick = () => {
      markModuleComplete(page.unit, page.module);
      btn.textContent = '✓ 已记录';
      btn.style.background = '#8e8e93';
      btn.disabled = true;
    };
    
    document.body.appendChild(btn);
  }
  
  // 页面加载完成后添加按钮
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCompleteButton);
  } else {
    addCompleteButton();
  }
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();