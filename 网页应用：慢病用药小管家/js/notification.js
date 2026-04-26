// 浏览器桌面通知与提醒系统

const NotificationManager = {
    // 请求通知权限
    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('此浏览器不支持桌面通知');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    },

    // 发送桌面通知
    send(title, body, icon = null) {
        if (Notification.permission === 'granted') {
            const options = {
                body: body,
                icon: icon || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">&#128138;</text></svg>',
                tag: 'chronic-med-' + Date.now(),
                requireInteraction: true
            };

            const notification = new Notification(title, options);
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return true;
        } else {
            this.showInAppToast(title, body);
            return false;
        }
    },

    // 应用内通知
    showInAppToast(title, message) {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 8000);
    },

    // 检查用药提醒
    checkMedicationReminders() {
        const plans = Storage.getMedPlans();
        const now = new Date();
        const hour = now.getHours();

        plans.forEach(plan => {
            if (!plan.isActive || !plan.reminderEnabled) return;

            const periods = plan.periods || [];
            const nowTime = `${hour.toString().padStart(2, '0')}:00`;

            let shouldNotify = false;
            if (periods.includes('早晨') && hour >= 6 && hour < 9) shouldNotify = true;
            if (periods.includes('中午') && hour >= 11 && hour < 14) shouldNotify = true;
            if (periods.includes('晚上') && hour >= 17 && hour < 20) shouldNotify = true;
            if (periods.includes('睡前') && hour >= 20 && hour < 23) shouldNotify = true;

            if (shouldNotify) {
                const today = this.formatDate(now);
                const records = Storage.getCheckinRecords();
                const todayRecord = records[today] || {};
                if (!todayRecord[plan.id]) {
                    this.send('用药提醒', `该服用「${plan.medName}」了，剂量：${plan.dose}`);
                }
            }
        });
    },

    // 检查复诊提醒
    checkFollowupReminders() {
        const followups = Storage.getFollowups();
        const now = new Date();

        followups.forEach(f => {
            if (f.completed) return;

            const followupDate = new Date(f.followupTime);
            const reminderDays = parseInt(f.reminderTime) || 3;
            const reminderDate = new Date(followupDate);
            reminderDate.setDate(reminderDate.getDate() - reminderDays);

            const diffDays = Math.ceil((reminderDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                this.send('复诊提醒', `您明天需要前往${f.hospitalName}复诊（${f.department} - ${f.doctorName}），请提前做好准备。`);
            }

            if (diffDays > 0 && diffDays <= 3) {
                this.send('复诊提醒', `您将在${diffDays}天后前往${f.hospitalName}复诊，请做好准备。`);
            }
        });
    },

    // 检查库存预警
    checkStockAlerts() {
        const plans = Storage.getMedPlans();

        plans.forEach(plan => {
            if (!plan.isActive || !plan.medTotal) return;

            const dailyDose = this.calculateDailyDose(plan);
            const remaining = plan.medTotal - (plan.dailyConsumed || 0);
            const daysLeft = Math.floor(remaining / dailyDose);

            if (daysLeft <= 7 && daysLeft > 0) {
                this.send('库存预警', `「${plan.medName}」库存不足，剩余约${daysLeft}天用量，请及时续方。`);
            } else if (daysLeft <= 0) {
                this.send('库存告急', `「${plan.medName}」已无可用库存，请立即续方！`);
            }
        });
    },

    // 计算每日服用剂量
    calculateDailyDose(plan) {
        if (plan.dailyDose) return plan.dailyDose;

        const freq = plan.frequency || '';
        const periods = plan.periods || [];

        if (freq.includes('每日1次')) return 1;
        if (freq.includes('每日2次')) return 2;
        if (freq.includes('每日3次')) return 3;
        if (freq.includes('隔日1次')) return 0.5;
        if (freq.includes('每周1次')) return 1 / 7;

        return periods.length || 1;
    },

    // 格式化日期
    formatDate(date) {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
};
