// Study Tracker - 自动记录学习进度到打卡系统
// 在每个学习页面引入此脚本

(function() {
  const STORAGE_KEY = 'miningEnglishCheckin';
  
  // 模块名称映射
  const moduleMap = {
    '词汇表': 'vocab',
    'vocab': 'vocab',
    '精读材料': 'reading',
    'reading': 'reading',
    '情境会话': 'dialogue',
    'dialog': 'dialogue',
    'dialogue': 'dialogue',
    '句型汇总': 'sentences',
    'sentence': 'sentences',
    'sentences': 'sentences'
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
  
  // 记录模块完成（供外部调用）
  function markComplete(moduleType, unitKey) {
    const data = loadData();
    
    // 解析单元号
    const unitNum = parseInt(unitKey.replace('unit', ''));
    const key = moduleMap[moduleType];
    if (!key || !unitNum) {
      console.warn('[StudyTracker] Invalid module or unit:', moduleType, unitKey);
      return;
    }
    
    if (!data.unitProgress[unitNum]) {
      data.unitProgress[unitNum] = { vocab: false, reading: false, dialogue: false, sentences: false };
    }
    
    data.unitProgress[unitNum][key] = true;
    saveData(data);
    
    console.log(`[StudyTracker] Unit ${unitNum} - ${moduleType} marked complete`);
    
    // 显示完成提示
    showCompleteToast(unitNum, moduleType);
  }
  
  // 显示完成提示
  function showCompleteToast(unit, moduleName) {
    const moduleNames = {
      'vocab': '词汇表',
      'reading': '精读材料',
      'dialogue': '情境会话',
      'sentences': '句型汇总'
    };
    
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
      box-shadow: 0 4px 12px rgba(48, 209, 88, 0.3);
    `;
    toast.textContent = `✓ Unit ${unit} ${moduleNames[moduleName] || moduleName} 学习完成！`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
  
  // 导出到全局
  window.studyTracker = {
    markComplete: markComplete,
    loadData: loadData,
    saveData: saveData
  };
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);
  
  console.log('[StudyTracker] Initialized');
})();