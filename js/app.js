// 慢病用药小管家 - 主应用逻辑

const App = {
    currentPage: 'home',
    currentCheckinDate: new Date(),
    currentCalendarMonth: new Date(),
    checkInterval: null,

    // 初始化应用
    init() {
        this.bindNavigation();
        this.bindModals();
        this.bindUserSection();
        this.bindHomePage();
        this.bindPlanPage();
        this.bindCheckinPage();
        this.bindFollowupPage();
        this.bindKnowledgePage();
        this.initKnowledgeBase();
        this.requestNotificationPermission();
        this.startReminderCheck();
        this.renderHomePage();
    },

    // ==================== 导航 ====================

    bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
                // 关闭移动端导航菜单
                document.querySelector('.navbar-nav').classList.remove('show');
            });
        });

        document.getElementById('navToggle').addEventListener('click', () => {
            document.querySelector('.navbar-nav').classList.toggle('show');
        });
    },

    navigateTo(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        document.querySelectorAll('.page').forEach(p => {
            p.classList.toggle('active', p.id === `page-${page}`);
        });

        // 渲染对应页面
        switch (page) {
            case 'home':
                this.renderHomePage();
                break;
            case 'medication-plan':
                this.renderPlanPage();
                break;
            case 'checkin':
                this.renderCheckinPage();
                break;
            case 'followup':
                this.renderFollowupPage();
                break;
            case 'knowledge':
                break;
        }
    },

    // ==================== 弹窗 ====================

    bindModals() {
        // 关闭弹窗
        document.querySelectorAll('.modal-close, .btn[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.dataset.modal;
                document.getElementById(modalId).classList.remove('show');
            });
        });

        // 点击遮罩关闭弹窗
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    },

    openModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    },

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    },

    // ==================== 用户信息区 ====================

    bindUserSection() {
        document.getElementById('editUserBtn').addEventListener('click', () => {
            const user = Storage.getUser();
            document.getElementById('nickname').value = user.nickname || '';
            const checkboxes = document.querySelectorAll('#chronicDiseasesGroup input');
            checkboxes.forEach(cb => {
                cb.checked = (user.chronicDiseases || []).includes(cb.value);
            });
            this.openModal('userModal');
        });

        document.getElementById('saveUserBtn').addEventListener('click', () => {
            const nickname = document.getElementById('nickname').value.trim();
            const chronicDiseases = Array.from(document.querySelectorAll('#chronicDiseasesGroup input:checked'))
                .map(cb => cb.value);

            Storage.saveUser({ nickname, chronicDiseases });
            this.closeModal('userModal');
            this.renderHomePage();
        });
    },

    // ==================== 首页 ====================

    bindHomePage() {
        document.getElementById('quickCheckinBtn').addEventListener('click', () => {
            this.navigateTo('checkin');
        });

        document.getElementById('addFollowupBtn').addEventListener('click', () => {
            this.navigateTo('followup');
        });

        document.getElementById('manageStockBtn').addEventListener('click', () => {
            this.navigateTo('followup');
        });

        document.getElementById('actionCheckin').addEventListener('click', () => {
            this.navigateTo('checkin');
        });

        document.getElementById('actionAddPlan').addEventListener('click', () => {
            this.resetPlanForm();
            document.getElementById('planModalTitle').textContent = '新增用药计划';
            this.openModal('planModal');
        });

        document.getElementById('actionAddFollowup').addEventListener('click', () => {
            this.resetFollowupForm();
            document.getElementById('followupModalTitle').textContent = '新增复诊';
            this.openModal('followupModal');
        });

        document.getElementById('actionKnowledge').addEventListener('click', () => {
            this.navigateTo('knowledge');
        });
    },

    renderHomePage() {
        const user = Storage.getUser();
        document.getElementById('userNickname').textContent = user.nickname || '未设置昵称';
        document.getElementById('userChronicDiseases').innerHTML = 
            (user.chronicDiseases || []).length > 0
                ? `${user.chronicDiseases.join('、')} <button class="btn-text" id="editUserBtn">&#9998; 编辑个人信息</button>`
                : '未设置慢病类型 <button class="btn-text" id="editUserBtn">&#9998; 编辑个人信息</button>';

        document.getElementById('editUserBtn').addEventListener('click', () => {
            const u = Storage.getUser();
            document.getElementById('nickname').value = u.nickname || '';
            const checkboxes = document.querySelectorAll('#chronicDiseasesGroup input');
            checkboxes.forEach(cb => {
                cb.checked = (u.chronicDiseases || []).includes(cb.value);
            });
            this.openModal('userModal');
        });

        this.renderTodayMedCards();
        this.renderNextVisitCard();
        this.renderStockAlertCard();
        this.renderMonthStats();
    },

    renderTodayMedCards() {
        const plans = Storage.getMedPlans().filter(p => p.isActive);
        const today = NotificationManager.formatDate(new Date());
        const records = Storage.getCheckinRecords();
        const todayRecord = records[today] || {};

        const pendingPlans = plans.filter(p => !todayRecord[p.id]);

        document.getElementById('todayMedCount').textContent = pendingPlans.length;

        if (pendingPlans.length > 0) {
            document.getElementById('todayMedDetails').textContent = 
                pendingPlans.slice(0, 3).map(p => p.medName).join('、') + 
                (pendingPlans.length > 3 ? ` 等${pendingPlans.length}种药品` : '');
        } else if (plans.length === 0) {
            document.getElementById('todayMedDetails').textContent = '暂无用药计划';
        } else {
            document.getElementById('todayMedDetails').textContent = '今日已全部打卡完成！';
        }
    },

    renderNextVisitCard() {
        const followups = Storage.getFollowups()
            .filter(f => !f.completed)
            .sort((a, b) => new Date(a.followupTime) - new Date(b.followupTime));

        if (followups.length === 0) {
            document.getElementById('nextVisitInfo').textContent = '暂无复诊安排';
            document.getElementById('nextVisitHospital').textContent = '';
            return;
        }

        const next = followups[0];
        const date = new Date(next.followupTime);
        const now = new Date();
        const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

        let timeText;
        if (diffDays < 0) {
            timeText = `已过期 ${Math.abs(diffDays)} 天`;
        } else if (diffDays === 0) {
            timeText = '今天';
        } else if (diffDays === 1) {
            timeText = '明天';
        } else {
            timeText = `${diffDays} 天后`;
        }

        document.getElementById('nextVisitInfo').textContent = `${timeText} - ${date.toLocaleDateString('zh-CN')}`;
        document.getElementById('nextVisitHospital').textContent = `${next.hospitalName} ${next.department || ''}`;
    },

    renderStockAlertCard() {
        const plans = Storage.getMedPlans().filter(p => p.isActive && p.medTotal);
        let alerts = [];

        plans.forEach(plan => {
            const dailyDose = NotificationManager.calculateDailyDose(plan);
            const remaining = plan.medTotal - (plan.dailyConsumed || 0);
            const daysLeft = Math.floor(remaining / dailyDose);

            if (daysLeft <= 7) {
                alerts.push({
                    name: plan.medName,
                    daysLeft: daysLeft,
                    level: daysLeft <= 0 ? 'danger' : 'warning'
                });
            }
        });

        if (alerts.length === 0) {
            document.getElementById('stockAlertInfo').textContent = '暂无库存预警';
            document.getElementById('stockAlertDetails').textContent = '';
        } else {
            document.getElementById('stockAlertInfo').textContent = `有 ${alerts.length} 种药品库存不足`;
            document.getElementById('stockAlertDetails').textContent = 
                alerts.map(a => `${a.name}（剩余${a.daysLeft <= 0 ? '已耗尽' : a.daysLeft + '天'}）`).join('、');
        }
    },

    renderMonthStats() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const records = Storage.getCheckinRecords();
        let takenDays = 0;
        let missedDays = 0;

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const dayRecord = records[dateStr] || {};
            const statuses = Object.values(dayRecord).map(r => r.status);

            if (statuses.length === 0) continue;
            if (statuses.every(s => s === 'taken')) {
                takenDays++;
            } else if (statuses.includes('missed')) {
                missedDays++;
            } else {
                takenDays++;
            }
        }

        const totalActiveDays = takenDays + missedDays;
        const compliance = totalActiveDays > 0 ? Math.round((takenDays / totalActiveDays) * 100) : 0;

        document.getElementById('monthTakenDays').textContent = takenDays;
        document.getElementById('monthMissedDays').textContent = missedDays;
        document.getElementById('monthCompliance').textContent = compliance + '%';
        document.getElementById('complianceFill').style.width = compliance + '%';

        // 绘制简易图表
        this.drawMonthChart(year, month, daysInMonth, records);
    },

    drawMonthChart(year, month, daysInMonth, records) {
        const canvas = document.getElementById('monthChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 150;

        ctx.clearRect(0, 0, width, height);

        const barWidth = (width - 40) / daysInMonth;
        const maxHeight = height - 40;

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const dayRecord = records[dateStr] || {};
            const statuses = Object.values(dayRecord).map(r => r.status);

            let color = '#E0E0E0';
            if (statuses.length > 0) {
                if (statuses.every(s => s === 'taken')) {
                    color = '#4CAF50';
                } else if (statuses.includes('missed')) {
                    color = '#F44336';
                } else {
                    color = '#FF9800';
                }
            }

            const barHeight = statuses.length > 0 ? maxHeight * 0.8 : maxHeight * 0.2;
            const x = 20 + (d - 1) * barWidth;
            const y = height - 20 - barHeight;

            ctx.fillStyle = color;
            ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }

        // 绘制坐标轴
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, height - 20);
        ctx.lineTo(width - 20, height - 20);
        ctx.stroke();
    },

    // ==================== 用药计划管理页 ====================

    bindPlanPage() {
        document.getElementById('addPlanBtn').addEventListener('click', () => {
            this.resetPlanForm();
            document.getElementById('planModalTitle').textContent = '新增用药计划';
            this.openModal('planModal');
        });

        document.getElementById('addPlanBtnEmpty').addEventListener('click', () => {
            this.resetPlanForm();
            document.getElementById('planModalTitle').textContent = '新增用药计划';
            this.openModal('planModal');
        });

        document.getElementById('savePlanBtn').addEventListener('click', () => {
            this.savePlan();
        });
    },

    resetPlanForm() {
        document.getElementById('planForm').reset();
        document.getElementById('planId').value = '';
        document.querySelectorAll('#medPeriodGroup input').forEach(cb => {
            cb.checked = false;
        });
    },

    savePlan() {
        const medName = document.getElementById('medName').value.trim();
        const dose = document.getElementById('medDose').value.trim();
        const frequency = document.getElementById('medFrequency').value;
        const periods = Array.from(document.querySelectorAll('#medPeriodGroup input:checked')).map(cb => cb.value);

        if (!medName || !dose || !frequency || periods.length === 0) {
            NotificationManager.showInAppToast('提示', '请填写必填项（药品名称、剂量、频次、时段）');
            return;
        }

        const planData = {
            medName: medName,
            medSpec: document.getElementById('medSpec').value.trim(),
            medManufacturer: document.getElementById('medManufacturer').value.trim(),
            dose: dose,
            frequency: frequency,
            periods: periods,
            cycle: parseInt(document.getElementById('medCycle').value) || 0,
            medTotal: parseInt(document.getElementById('medTotal').value) || 0,
            notes: document.getElementById('medNotes').value.trim()
        };

        const planId = document.getElementById('planId').value;
        if (planId) {
            // 编辑
            Storage.updateMedPlan(planId, planData);
        } else {
            // 新增
            planData.dailyConsumed = 0;
            Storage.addMedPlan(planData);
        }

        this.closeModal('planModal');
        this.renderPlanPage();
        this.renderHomePage();
    },

    editPlan(id) {
        const plan = Storage.getMedPlans().find(p => p.id === id);
        if (!plan) return;

        document.getElementById('planId').value = plan.id;
        document.getElementById('medName').value = plan.medName || '';
        document.getElementById('medSpec').value = plan.medSpec || '';
        document.getElementById('medManufacturer').value = plan.medManufacturer || '';
        document.getElementById('medDose').value = plan.dose || '';
        document.getElementById('medFrequency').value = plan.frequency || '';
        document.getElementById('medCycle').value = plan.cycle || '';
        document.getElementById('medTotal').value = plan.medTotal || '';
        document.getElementById('medNotes').value = plan.notes || '';

        document.querySelectorAll('#medPeriodGroup input').forEach(cb => {
            cb.checked = (plan.periods || []).includes(cb.value);
        });

        document.getElementById('planModalTitle').textContent = '编辑用药计划';
        this.openModal('planModal');
    },

    deletePlan(id) {
        if (confirm('确定要删除此用药计划吗？')) {
            Storage.deleteMedPlan(id);
            this.renderPlanPage();
            this.renderHomePage();
        }
    },

    togglePlan(id) {
        const plan = Storage.getMedPlans().find(p => p.id === id);
        if (plan) {
            Storage.updateMedPlan(id, { isActive: !plan.isActive });
            this.renderPlanPage();
            this.renderHomePage();
        }
    },

    toggleReminder(id) {
        const plan = Storage.getMedPlans().find(p => p.id === id);
        if (plan) {
            Storage.updateMedPlan(id, { reminderEnabled: !plan.reminderEnabled });
            this.renderPlanPage();
        }
    },

    renderPlanPage() {
        const plans = Storage.getMedPlans();
        const list = document.getElementById('planList');
        const emptyState = document.getElementById('planEmptyState');

        if (plans.length === 0) {
            list.innerHTML = '';
            list.appendChild(emptyState);
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        list.innerHTML = plans.map(plan => {
            const dailyDose = NotificationManager.calculateDailyDose(plan);
            let stockStatus = '';
            let cardClass = 'plan-card';

            if (plan.medTotal) {
                const remaining = plan.medTotal - (plan.dailyConsumed || 0);
                const daysLeft = Math.floor(remaining / dailyDose);
                if (daysLeft <= 0) {
                    stockStatus = `<span style="color: #F44336;"> 已耗尽</span>`;
                    cardClass += ' danger';
                } else if (daysLeft <= 7) {
                    stockStatus = `<span style="color: #FF9800;"> 剩余${daysLeft}天</span>`;
                    cardClass += ' warning';
                }
            }

            if (!plan.isActive) {
                cardClass += ' inactive';
            }

            return `
                <div class="${cardClass}">
                    <div class="plan-header">
                        <div class="plan-name">${plan.medName} ${plan.medSpec ? '(' + plan.medSpec + ')' : ''}${stockStatus}</div>
                        <div class="plan-status">
                            <label class="switch" title="提醒开关">
                                <input type="checkbox" ${plan.reminderEnabled ? 'checked' : ''} onchange="App.toggleReminder('${plan.id}')">
                                <span class="slider"></span>
                            </label>
                            <label class="switch" title="启用/停用">
                                <input type="checkbox" ${plan.isActive ? 'checked' : ''} onchange="App.togglePlan('${plan.id}')">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="plan-details">
                        <div class="plan-detail-item"><strong>厂家：</strong>${plan.medManufacturer || '-'}</div>
                        <div class="plan-detail-item"><strong>剂量：</strong>${plan.dose}</div>
                        <div class="plan-detail-item"><strong>频次：</strong>${plan.frequency}</div>
                        <div class="plan-detail-item"><strong>时段：</strong>${(plan.periods || []).join('、') || '-'}</div>
                        <div class="plan-detail-item"><strong>周期：</strong>${plan.cycle ? plan.cycle + '天' : '长期'}</div>
                    </div>
                    ${plan.notes ? `<div class="plan-notes"><strong>注意事项：</strong>${plan.notes}</div>` : ''}
                    <div class="plan-actions">
                        <button class="btn btn-small btn-primary" onclick="App.editPlan('${plan.id}')">&#9998; 编辑</button>
                        <button class="btn btn-small btn-danger" onclick="App.deletePlan('${plan.id}')">&#128465; 删除</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // ==================== 用药打卡页 ====================

    bindCheckinPage() {
        document.getElementById('prevDayBtn').addEventListener('click', () => {
            this.currentCheckinDate.setDate(this.currentCheckinDate.getDate() - 1);
            this.renderCheckinPage();
        });

        document.getElementById('nextDayBtn').addEventListener('click', () => {
            this.currentCheckinDate.setDate(this.currentCheckinDate.getDate() + 1);
            this.renderCheckinPage();
        });

        document.getElementById('prevMonthBtn').addEventListener('click', () => {
            this.currentCalendarMonth.setMonth(this.currentCalendarMonth.getMonth() - 1);
            this.renderCheckinPage();
        });

        document.getElementById('nextMonthBtn').addEventListener('click', () => {
            this.currentCalendarMonth.setMonth(this.currentCalendarMonth.getMonth() + 1);
            this.renderCheckinPage();
        });
    },

    renderCheckinPage() {
        const today = NotificationManager.formatDate(this.currentCheckinDate);
        document.getElementById('currentCheckinDate').textContent = today;

        const now = new Date();
        const isToday = NotificationManager.formatDate(now) === today;
        document.getElementById('checkinDateTitle').textContent = isToday ? '今日用药清单' : `${today} 用药记录`;

        this.renderCheckinList(today);
        this.renderHistoryCalendar();
    },

    renderCheckinList(dateStr) {
        const plans = Storage.getMedPlans().filter(p => p.isActive);
        const records = Storage.getCheckinRecords();
        const dayRecord = records[dateStr] || {};
        const list = document.getElementById('checkinList');
        const emptyState = document.getElementById('checkinEmptyState');

        if (plans.length === 0) {
            list.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        list.innerHTML = plans.map(plan => {
            const record = dayRecord[plan.id];
            const status = record ? record.status : 'pending';

            let statusBadge;
            let actionButtons;

            if (status === 'taken') {
                statusBadge = '<span class="status-badge taken">已服用</span>';
                actionButtons = `<span style="color: #4CAF50;">打卡时间：${record.time}</span>`;
            } else if (status === 'missed') {
                statusBadge = '<span class="status-badge missed">已漏服</span>';
                actionButtons = `<button class="btn btn-small btn-success" onclick="App.doCheckin('${dateStr}', '${plan.id}', 'taken')">改为已服用</button>`;
            } else {
                statusBadge = '<span class="status-badge pending">待服用</span>';
                actionButtons = `
                    <button class="btn btn-small btn-success" onclick="App.doCheckin('${dateStr}', '${plan.id}', 'taken')">已服用</button>
                    <button class="btn btn-small btn-danger" onclick="App.doCheckin('${dateStr}', '${plan.id}', 'missed')">漏服</button>
                `;
            }

            return `
                <div class="checkin-item status-${status}">
                    <div class="checkin-info">
                        <div class="checkin-med-name">${plan.medName} ${statusBadge}</div>
                        <div class="checkin-med-detail">剂量：${plan.dose} | 频次：${plan.frequency} | 时段：${(plan.periods || []).join('、')}</div>
                    </div>
                    <div class="checkin-actions">
                        ${actionButtons}
                    </div>
                </div>
            `;
        }).join('');
    },

    doCheckin(date, planId, status) {
        Storage.addCheckinRecord(date, planId, status);

        // 更新库存消耗
        if (status === 'taken') {
            const plan = Storage.getMedPlans().find(p => p.id === planId);
            if (plan && plan.medTotal) {
                const consumed = (plan.dailyConsumed || 0) + 1;
                Storage.updateMedPlan(planId, { dailyConsumed: consumed });
            }
        }

        this.renderCheckinPage();
        this.renderHomePage();

        if (status === 'taken') {
            NotificationManager.showInAppToast('打卡成功', '已记录，请继续保持！');
        } else {
            NotificationManager.showInAppToast('已标记漏服', '下次记得按时服药哦！');
        }
    },

    renderHistoryCalendar() {
        const year = this.currentCalendarMonth.getFullYear();
        const month = this.currentCalendarMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        document.getElementById('currentMonth').textContent = `${year}年${month + 1}月`;

        const records = Storage.getCheckinRecords();
        const plans = Storage.getMedPlans().filter(p => p.isActive);

        let takenDays = 0;
        let missedDays = 0;

        let html = `
            <div class="calendar-header">日</div>
            <div class="calendar-header">一</div>
            <div class="calendar-header">二</div>
            <div class="calendar-header">三</div>
            <div class="calendar-header">四</div>
            <div class="calendar-header">五</div>
            <div class="calendar-header">六</div>
        `;

        // 空白填充
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const dayRecord = records[dateStr] || {};
            const statuses = Object.values(dayRecord).map(r => r.status);

            let dayClass = '';
            if (statuses.length > 0) {
                const allTaken = plans.every(p => dayRecord[p.id]?.status === 'taken');
                const anyMissed = plans.some(p => dayRecord[p.id]?.status === 'missed');
                
                if (anyMissed) {
                    dayClass = 'missed';
                    missedDays++;
                } else if (allTaken) {
                    dayClass = 'taken';
                    takenDays++;
                } else {
                    dayClass = 'partial';
                }
            }

            html += `<div class="calendar-day ${dayClass}">${d}</div>`;
        }

        document.getElementById('historyCalendar').innerHTML = html;

        const totalDays = takenDays + missedDays;
        const compliance = totalDays > 0 ? Math.round((takenDays / totalDays) * 100) : 0;

        document.getElementById('histTakenDays').textContent = takenDays + ' 天';
        document.getElementById('histMissedDays').textContent = missedDays + ' 天';
        document.getElementById('histCompliance').textContent = compliance + '%';
    },

    // ==================== 复诊与续方管理页 ====================

    bindFollowupPage() {
        document.getElementById('addFollowupVisitBtn').addEventListener('click', () => {
            this.resetFollowupForm();
            document.getElementById('followupModalTitle').textContent = '新增复诊';
            this.openModal('followupModal');
        });

        document.getElementById('addFollowupEmptyBtn').addEventListener('click', () => {
            this.resetFollowupForm();
            document.getElementById('followupModalTitle').textContent = '新增复诊';
            this.openModal('followupModal');
        });

        document.getElementById('saveFollowupBtn').addEventListener('click', () => {
            this.saveFollowup();
        });
    },

    resetFollowupForm() {
        document.getElementById('followupForm').reset();
        document.getElementById('followupId').value = '';
        document.getElementById('doctorAdvice').value = '';
    },

    saveFollowup() {
        const hospitalName = document.getElementById('hospitalName').value.trim();
        const followupTime = document.getElementById('followupTime').value;

        if (!hospitalName || !followupTime) {
            NotificationManager.showInAppToast('提示', '请填写医院名称和复诊时间');
            return;
        }

        const followupData = {
            hospitalName: hospitalName,
            department: document.getElementById('department').value.trim(),
            doctorName: document.getElementById('doctorName').value.trim(),
            followupTime: followupTime,
            appointmentType: document.getElementById('appointmentType').value,
            reminderTime: document.getElementById('reminderTime').value,
            notes: document.getElementById('followupNotes').value.trim(),
            doctorAdvice: document.getElementById('doctorAdvice').value.trim()
        };

        const followupId = document.getElementById('followupId').value;
        if (followupId) {
            Storage.updateFollowup(followupId, followupData);
        } else {
            Storage.addFollowup(followupData);
        }

        this.closeModal('followupModal');
        this.renderFollowupPage();
        this.renderHomePage();
    },

    editFollowup(id) {
        const f = Storage.getFollowups().find(item => item.id === id);
        if (!f) return;

        document.getElementById('followupId').value = f.id;
        document.getElementById('hospitalName').value = f.hospitalName || '';
        document.getElementById('department').value = f.department || '';
        document.getElementById('doctorName').value = f.doctorName || '';
        document.getElementById('followupTime').value = f.followupTime || '';
        document.getElementById('appointmentType').value = f.appointmentType || '';
        document.getElementById('reminderTime').value = f.reminderTime || '3';
        document.getElementById('followupNotes').value = f.notes || '';
        document.getElementById('doctorAdvice').value = f.doctorAdvice || '';

        document.getElementById('followupModalTitle').textContent = '编辑复诊';
        this.openModal('followupModal');
    },

    deleteFollowup(id) {
        if (confirm('确定要删除此复诊记录吗？')) {
            Storage.deleteFollowup(id);
            this.renderFollowupPage();
            this.renderHomePage();
        }
    },

    completeFollowup(id) {
        Storage.updateFollowup(id, { completed: true });
        this.renderFollowupPage();
        this.renderHomePage();
    },

    updateStock(planId) {
        const input = document.getElementById(`stock-input-${planId}`);
        const amount = parseInt(input.value) || 0;

        if (amount > 0) {
            const plan = Storage.getMedPlans().find(p => p.id === planId);
            const newTotal = (plan.medTotal || 0) + amount;
            Storage.updateMedPlan(planId, { 
                medTotal: newTotal,
                dailyConsumed: 0
            });
            input.value = '';
            this.renderFollowupPage();
            this.renderHomePage();
        }
    },

    renderFollowupPage() {
        this.renderFollowupList();
        this.renderStockList();
    },

    renderFollowupList() {
        const followups = Storage.getFollowups().sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return new Date(a.followupTime) - new Date(b.followupTime);
        });

        const list = document.getElementById('followupList');
        const emptyState = document.getElementById('followupEmptyState');

        if (followups.length === 0) {
            list.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        const now = new Date();

        list.innerHTML = followups.map(f => {
            const followupDate = new Date(f.followupTime);
            const diffDays = Math.ceil((followupDate - now) / (1000 * 60 * 60 * 24));
            
            let cardClass = 'followup-card';
            let statusText = '';

            if (f.completed) {
                cardClass += ' completed';
                statusText = '已完成';
            } else if (diffDays < 0) {
                statusText = `已过期 ${Math.abs(diffDays)} 天`;
            } else if (diffDays === 0) {
                statusText = '今天';
                cardClass += ' upcoming';
            } else if (diffDays <= 7) {
                statusText = `${diffDays} 天后`;
                cardClass += ' upcoming';
            } else {
                statusText = `${diffDays} 天后`;
            }

            return `
                <div class="${cardClass}">
                    <div class="plan-header">
                        <div class="plan-name">${f.hospitalName} - ${f.department || '未设科室'} 
                            <span class="status-badge ${f.completed ? 'taken' : diffDays < 0 ? 'missed' : 'pending'}">${statusText}</span>
                        </div>
                        <div class="plan-status">
                            ${!f.completed ? `<button class="btn btn-small btn-success" onclick="App.completeFollowup('${f.id}')">完成</button>` : ''}
                            <button class="btn btn-small btn-primary" onclick="App.editFollowup('${f.id}')">编辑</button>
                            <button class="btn btn-small btn-danger" onclick="App.deleteFollowup('${f.id}')">删除</button>
                        </div>
                    </div>
                    <div class="followup-info-grid">
                        <div class="followup-info-item"><strong>医生</strong>${f.doctorName || '-'}</div>
                        <div class="followup-info-item"><strong>复诊时间</strong>${followupDate.toLocaleString('zh-CN')}</div>
                        <div class="followup-info-item"><strong>预约方式</strong>${f.appointmentType || '-'}</div>
                        <div class="followup-info-item"><strong>提前提醒</strong>提前${f.reminderTime || 3}天</div>
                    </div>
                    ${f.notes ? `<div class="plan-notes"><strong>备注：</strong>${f.notes}</div>` : ''}
                    ${f.doctorAdvice ? `<div class="followup-advice"><strong>医嘱/用药调整：</strong>${f.doctorAdvice}</div>` : ''}
                </div>
            `;
        }).join('');
    },

    renderStockList() {
        const plans = Storage.getMedPlans().filter(p => p.medTotal > 0 || p.isActive);
        const list = document.getElementById('stockList');
        const emptyState = document.getElementById('stockEmptyState');

        if (plans.length === 0) {
            list.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        list.innerHTML = plans.map(plan => {
            const dailyDose = NotificationManager.calculateDailyDose(plan);
            const total = plan.medTotal || 0;
            const consumed = plan.dailyConsumed || 0;
            const remaining = total - consumed;
            const daysLeft = dailyDose > 0 ? Math.floor(remaining / dailyDose) : 0;
            const percentage = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;

            let cardClass = 'stock-card';
            let statusColor = 'normal';

            if (daysLeft <= 0 || remaining <= 0) {
                cardClass += ' danger';
                statusColor = 'danger';
            } else if (daysLeft <= 7) {
                cardClass += ' warning';
                statusColor = 'warning';
            }

            return `
                <div class="${cardClass}">
                    <div class="stock-header">
                        <div class="stock-name">${plan.medName} ${plan.medSpec ? '(' + plan.medSpec + ')' : ''}</div>
                        ${daysLeft <= 7 ? `<span class="status-badge ${daysLeft <= 0 ? 'missed' : 'pending'}">${daysLeft <= 0 ? '已耗尽' : '库存不足'}</span>` : ''}
                    </div>
                    <div class="stock-details">
                        <div class="stock-item">
                            <div class="stock-item-value">${total}</div>
                            <div class="stock-item-label">总量（片/粒）</div>
                        </div>
                        <div class="stock-item">
                            <div class="stock-item-value">${consumed}</div>
                            <div class="stock-item-label">已服用</div>
                        </div>
                        <div class="stock-item">
                            <div class="stock-item-value">${Math.max(0, remaining)}</div>
                            <div class="stock-item-label">剩余</div>
                        </div>
                        <div class="stock-item">
                            <div class="stock-item-value">${Math.max(0, daysLeft)}</div>
                            <div class="stock-item-label">可用天数</div>
                        </div>
                    </div>
                    <div class="stock-bar">
                        <div class="stock-bar-fill ${statusColor}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="stock-input-row">
                        <input type="number" id="stock-input-${plan.id}" placeholder="续方数量" min="1">
                        <button class="btn btn-small btn-primary" onclick="App.updateStock('${plan.id}')">添加库存</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // ==================== 知识库页 ====================

    bindKnowledgePage() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                e.currentTarget.classList.add('active');
                const tabId = e.currentTarget.dataset.tab;
                document.getElementById(tabId).classList.add('active');
            });
        });
    },

    initKnowledgeBase() {
        // 渲染知识库数据
        renderKnowledgeSection('knowledgeCommon', knowledgeData.common);
        renderKnowledgeSection('knowledgeInteraction', knowledgeData.interaction);
        renderKnowledgeSection('knowledgeFaq', knowledgeData.faq);
    },

    // ==================== 提醒系统 ====================

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            NotificationManager.requestPermission();
        }
    },

    startReminderCheck() {
        // 每分钟检查一次提醒
        this.checkInterval = setInterval(() => {
            NotificationManager.checkMedicationReminders();
            NotificationManager.checkFollowupReminders();
            NotificationManager.checkStockAlerts();
        }, 60000);

        // 初始化时检查一次
        setTimeout(() => {
            NotificationManager.checkMedicationReminders();
            NotificationManager.checkFollowupReminders();
            NotificationManager.checkStockAlerts();
        }, 3000);
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
