// 本地存储工具模块

const Storage = {
    // 获取用户信息
    getUser() {
        const user = localStorage.getItem('mc_user');
        return user ? JSON.parse(user) : { nickname: '', chronicDiseases: [] };
    },

    // 保存用户信息
    saveUser(user) {
        localStorage.setItem('mc_user', JSON.stringify(user));
    },

    // 获取用药计划列表
    getMedPlans() {
        const plans = localStorage.getItem('mc_med_plans');
        return plans ? JSON.parse(plans) : [];
    },

    // 保存用药计划列表
    saveMedPlans(plans) {
        localStorage.setItem('mc_med_plans', JSON.stringify(plans));
    },

    // 添加用药计划
    addMedPlan(plan) {
        const plans = this.getMedPlans();
        plan.id = Date.now().toString();
        plan.createdAt = new Date().toISOString();
        plan.isActive = true;
        plan.reminderEnabled = true;
        plans.push(plan);
        this.saveMedPlans(plans);
        return plan;
    },

    // 更新用药计划
    updateMedPlan(id, updates) {
        const plans = this.getMedPlans();
        const index = plans.findIndex(p => p.id === id);
        if (index !== -1) {
            plans[index] = { ...plans[index], ...updates };
            this.saveMedPlans(plans);
        }
    },

    // 删除用药计划
    deleteMedPlan(id) {
        const plans = this.getMedPlans().filter(p => p.id !== id);
        this.saveMedPlans(plans);
    },

    // 获取打卡记录
    getCheckinRecords() {
        const records = localStorage.getItem('mc_checkin_records');
        return records ? JSON.parse(records) : {};
    },

    // 保存打卡记录
    saveCheckinRecords(records) {
        localStorage.setItem('mc_checkin_records', JSON.stringify(records));
    },

    // 添加打卡记录
    addCheckinRecord(date, planId, status) {
        const records = this.getCheckinRecords();
        if (!records[date]) {
            records[date] = {};
        }
        records[date][planId] = {
            status: status, // 'taken' 或 'missed'
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        this.saveCheckinRecords(records);
    },

    // 获取复诊记录
    getFollowups() {
        const followups = localStorage.getItem('mc_followups');
        return followups ? JSON.parse(followups) : [];
    },

    // 保存复诊记录
    saveFollowups(followups) {
        localStorage.setItem('mc_followups', JSON.stringify(followups));
    },

    // 添加复诊记录
    addFollowup(followup) {
        const list = this.getFollowups();
        followup.id = Date.now().toString();
        followup.createdAt = new Date().toISOString();
        followup.completed = false;
        list.push(followup);
        this.saveFollowups(list);
        return followup;
    },

    // 更新复诊记录
    updateFollowup(id, updates) {
        const list = this.getFollowups();
        const index = list.findIndex(f => f.id === id);
        if (index !== -1) {
            list[index] = { ...list[index], ...updates };
            this.saveFollowups(list);
        }
    },

    // 删除复诊记录
    deleteFollowup(id) {
        const list = this.getFollowups().filter(f => f.id !== id);
        this.saveFollowups(list);
    }
};
