// 用药安全知识库数据
const knowledgeData = {
    common: [
        {
            title: "高血压用药常识",
            tags: ["高血压", "降压药"],
            content: `<p>高血压是常见的慢性心血管疾病，需长期规律服药控制血压。</p>
                <p><strong>常用降压药物分类：</strong></p>
                <ul>
                    <li><strong>钙通道阻滞剂（CCB）</strong>：如氨氯地平、硝苯地平等，适用于老年高血压患者</li>
                    <li><strong>血管紧张素转换酶抑制剂（ACEI）</strong>：如依那普利、贝那普利等，合并糖尿病者优选</li>
                    <li><strong>血管紧张素II受体拮抗剂（ARB）</strong>：如缬沙坦、厄贝沙坦等，耐受性较好</li>
                    <li><strong>利尿剂</strong>：如氢氯噻嗪、吲达帕胺等，常与其他降压药联合使用</li>
                    <li><strong>β受体阻滞剂</strong>：如美托洛尔、比索洛尔等，合并心绞痛者适用</li>
                </ul>
                <p><strong>服药注意事项：</strong></p>
                <ul>
                    <li>降压药一般需每天定时服用，不可随意停药或减量</li>
                    <li>早晨血压较高者，建议晨起后立即服药</li>
                    <li>定期监测血压并记录，复诊时带给医生参考</li>
                </ul>`
        },
        {
            title: "糖尿病用药常识",
            tags: ["糖尿病", "降糖药"],
            content: `<p>糖尿病需综合管理，药物治疗是重要环节之一。</p>
                <p><strong>常用降糖药物分类：</strong></p>
                <ul>
                    <li><strong>二甲双胍</strong>：一线降糖药，改善胰岛素敏感性，建议餐中或餐后服用以减少胃肠不适</li>
                    <li><strong>磺脲类</strong>：如格列美脲、格列齐特等，餐前30分钟服用</li>
                    <li><strong>DPP-4抑制剂</strong>：如西格列汀、利格列汀等，每天一次，不受进食影响</li>
                    <li><strong>SGLT-2抑制剂</strong>：如达格列净、恩格列净等，每天一次早晨服用</li>
                    <li><strong>胰岛素</strong>：注射用药，需严格按医嘱使用，注意低血糖风险</li>
                </ul>
                <p><strong>服药注意事项：</strong></p>
                <ul>
                    <li>降糖药需按时服用，避免漏服导致血糖波动</li>
                    <li>外出时随身携带糖果，预防低血糖</li>
                    <li>定期监测血糖，记录数据供复诊参考</li>
                </ul>`
        },
        {
            title: "冠心病用药常识",
            tags: ["冠心病", "心血管"],
            content: `<p>冠心病患者需长期服药以预防心肌梗死等严重事件。</p>
                <p><strong>常用药物：</strong></p>
                <ul>
                    <li><strong>抗血小板药</strong>：如阿司匹林、氯吡格雷等，预防血栓形成</li>
                    <li><strong>他汀类降脂药</strong>：如阿托伐他汀、瑞舒伐他汀等，降低血脂、稳定斑块</li>
                    <li><strong>β受体阻滞剂</strong>：如美托洛尔等，减慢心率、降低心肌耗氧</li>
                    <li><strong>硝酸酯类</strong>：如硝酸甘油，心绞痛发作时舌下含服急救</li>
                </ul>
                <p><strong>服药注意事项：</strong></p>
                <ul>
                    <li>阿司匹林建议餐后服用，减少胃刺激</li>
                    <li>他汀类药物建议晚间服用，因为胆固醇夜间合成最多</li>
                    <li>硝酸甘油需随身携带，心绞痛发作时立即舌下含服</li>
                </ul>`
        },
        {
            title: "高血脂用药常识",
            tags: ["高血脂", "降脂药"],
            content: `<p>高血脂是心血管疾病的重要危险因素，需长期管理。</p>
                <p><strong>常用降脂药物：</strong></p>
                <ul>
                    <li><strong>他汀类</strong>：如阿托伐他汀、辛伐他汀等，降低胆固醇为主</li>
                    <li><strong>贝特类</strong>：如非诺贝特等，降低甘油三酯为主</li>
                    <li><strong>依折麦布</strong>：抑制肠道胆固醇吸收，常与他汀联用</li>
                </ul>
                <p><strong>服药注意事项：</strong></p>
                <ul>
                    <li>他汀类药物建议睡前服用效果最佳</li>
                    <li>服药期间需定期复查肝功能和肌酸激酶</li>
                    <li>如出现肌肉酸痛、乏力等症状，及时就医</li>
                </ul>`
        },
        {
            title: "慢阻肺用药常识",
            tags: ["慢阻肺", "呼吸系统"],
            content: `<p>慢阻肺（COPD）需要长期规范用药以改善呼吸功能。</p>
                <p><strong>常用药物：</strong></p>
                <ul>
                    <li><strong>支气管扩张剂</strong>：如沙丁胺醇（急救用）、噻托溴铵（维持治疗）</li>
                    <li><strong>吸入糖皮质激素</strong>：如布地奈德、氟替卡松等，减轻气道炎症</li>
                    <li><strong>复合制剂</strong>：如舒利迭、信必可等，含支气管扩张剂和激素</li>
                </ul>
                <p><strong>服药注意事项：</strong></p>
                <ul>
                    <li>吸入药物使用后需漱口，减少口腔副作用</li>
                    <li>掌握正确的吸入方法，确保药物到达肺部</li>
                    <li>急性发作时立即使用急救药物并就医</li>
                </ul>`
        }
    ],
    interaction: [
        {
            title: "常见药物相互作用提醒",
            tags: ["药物相互作用", "安全用药"],
            content: `<p>多种药物同时服用可能产生相互作用，影响疗效或增加副作用。</p>
                <p><strong>需要特别注意的药物组合：</strong></p>
                <ul>
                    <li><strong>阿司匹林 + 华法林</strong>：增加出血风险，需密切监测凝血指标</li>
                    <li><strong>他汀类 + 某些抗生素</strong>（如红霉素、克拉霉素）：增加肌肉损伤风险</li>
                    <li><strong>降压药 + 利尿剂</strong>：可能引起血压过低，需调整剂量</li>
                    <li><strong>二甲双胍 + 造影剂</strong>：使用造影剂前后需暂停二甲双胍</li>
                    <li><strong>ACEI类 + 保钾利尿剂</strong>：可能引起高钾血症</li>
                    <li><strong>华法林 + 维生素K丰富食物</strong>：菠菜、西兰花等会降低华法林效果</li>
                </ul>
                <p><strong>建议：</strong>就诊时告知医生您正在服用的所有药物，包括保健品。</p>`
        },
        {
            title: "用药禁忌与注意事项",
            tags: ["用药禁忌", "安全用药"],
            content: `<p><strong>服药期间应避免的行为：</strong></p>
                <ul>
                    <li><strong>服药期间饮酒</strong>：酒精与多种药物发生反应，尤其与头孢类、降糖药、镇静药等同服可导致严重不良反应</li>
                    <li><strong>用茶水、果汁服药</strong>：茶水中的鞣酸、果汁中的酸性成分可能影响药物吸收，建议用温开水送服</li>
                    <li><strong>自行增减药量</strong>：不可因感觉好转就自行减药或停药，尤其降压药、降糖药</li>
                    <li><strong>随意混用感冒药</strong>：多种感冒药同时服用可能导致对乙酰氨基酚过量，损伤肝脏</li>
                    <li><strong>过期药物继续使用</strong>：过期药物可能失效或产生有害物质</li>
                </ul>
                <p><strong>特殊人群用药注意：</strong></p>
                <ul>
                    <li>肝肾功能不全者需调整用药剂量</li>
                    <li>孕妇和哺乳期妇女用药需遵医嘱</li>
                    <li>老年患者对药物更敏感，需从小剂量开始</li>
                </ul>`
        },
        {
            title: "服药与饮食的关系",
            tags: ["饮食", "服药时间"],
            content: `<p><strong>饭前服用的药物（餐前30-60分钟）：</strong></p>
                <ul>
                    <li>胃黏膜保护剂（如硫糖铝）</li>
                    <li>部分降糖药（如格列美脲）</li>
                    <li>促胃动力药（如多潘立酮）</li>
                </ul>
                <p><strong>饭后服用的药物（餐后15-30分钟）：</strong></p>
                <ul>
                    <li>非甾体抗炎药（如布洛芬、阿司匹林）</li>
                    <li>部分抗生素</li>
                    <li>铁剂、钙剂</li>
                </ul>
                <p><strong>空腹服用的药物（餐前1小时或餐后2小时）：</strong></p>
                <ul>
                    <li>甲状腺素（如左甲状腺素钠）</li>
                    <li>部分抗生素（如阿莫西林）</li>
                </ul>
                <p><strong>需避免与药物同食的食物：</strong></p>
                <ul>
                    <li><strong>西柚/葡萄柚</strong>：影响多种药物代谢，包括降压药、他汀类</li>
                    <li><strong>高钙食物</strong>：与某些抗生素同服影响吸收</li>
                    <li><strong>高脂饮食</strong>：影响部分药物的吸收</li>
                </ul>`
        },
        {
            title: "漏服药物处理方法",
            tags: ["漏服", "处理方法"],
            content: `<p>偶尔漏服药物不必过于紧张，但需要正确处理：</p>
                <p><strong>通用原则：</strong></p>
                <ul>
                    <li>想起时距离下次服药时间还长（超过间隔的一半），立即补服</li>
                    <li>想起时已接近下次服药时间，跳过漏服的剂量，不可加倍服用</li>
                    <li>不要为了弥补漏服而一次性服用双倍剂量</li>
                </ul>
                <p><strong>特殊药物处理：</strong></p>
                <ul>
                    <li><strong>降压药</strong>：漏服后若血压明显升高，立即补服；若接近下次服药时间则跳过</li>
                    <li><strong>降糖药</strong>：漏服后注意监测血糖，如已用餐可补服，未用餐可随餐补服</li>
                    <li><strong>抗凝药（华法林）</strong>：当天想起立即补服，第二天想起无需补服，记录并告知医生</li>
                </ul>
                <p><strong>建议：</strong>使用本应用的打卡功能，减少漏服情况。</p>`
        }
    ],
    faq: [
        {
            title: "降压药需要终身服用吗？",
            tags: ["高血压", "长期用药"],
            content: `<p>大多数高血压患者需要长期甚至终身服药。</p>
                <p>高血压是一种慢性疾病，目前尚无根治方法。降压药的作用是控制血压在安全范围内，减少心脑血管并发症的风险。</p>
                <p><strong>以下情况可在医生指导下调整用药：</strong></p>
                <ul>
                    <li>通过改善生活方式（减重、限盐、运动），血压长期稳定在正常范围</li>
                    <li>出现药物不良反应，需要更换药物</li>
                    <li>合并其他疾病需要调整用药方案</li>
                </ul>
                <p><strong>重要提醒：</strong>切勿自行停药或减药，即使血压正常，那也是药物在起作用。自行停药可能导致血压反弹，增加中风、心梗风险。</p>`
        },
        {
            title: "降糖药什么时候吃效果最好？",
            tags: ["糖尿病", "服药时间"],
            content: `<p>不同降糖药的服用时间不同：</p>
                <ul>
                    <li><strong>二甲双胍</strong>：餐中或餐后服用，减少胃肠刺激</li>
                    <li><strong>磺脲类（格列美脲等）</strong>：餐前30分钟服用</li>
                    <li><strong>阿卡波糖</strong>：与第一口饭同时嚼服</li>
                    <li><strong>DPP-4抑制剂</strong>：每天固定时间，不受进食影响</li>
                    <li><strong>SGLT-2抑制剂</strong>：每天早晨服用一次</li>
                </ul>
                <p>建议设置闹钟或使用本应用的用药提醒功能，确保按时服药。</p>`
        },
        {
            title: "保健品可以代替药物吗？",
            tags: ["保健品", "用药误区"],
            content: `<p><strong>不能。</strong>保健品不是药品，不能替代药物治疗。</p>
                <p>保健品主要用于调节身体机能、补充营养，但没有治疗疾病的功效。</p>
                <p><strong>需要注意：</strong></p>
                <ul>
                    <li>某些保健品可能与药物发生相互作用，如鱼油与抗凝药同服增加出血风险</li>
                    <li>钙剂与某些抗生素同服影响吸收</li>
                    <li>银杏制剂与阿司匹林同服增加出血风险</li>
                </ul>
                <p>服用保健品前请咨询医生，告知正在使用的药物。</p>`
        },
        {
            title: "药物出现副作用怎么办？",
            tags: ["副作用", "用药安全"],
            content: `<p>服药期间如出现不适，应区分是药物副作用还是疾病本身症状：</p>
                <p><strong>常见副作用及处理：</strong></p>
                <ul>
                    <li><strong>胃肠不适</strong>：可尝试改为餐后服用，如持续不缓解应就医</li>
                    <li><strong>头晕</strong>：降压药常见副作用，起身时动作放缓</li>
                    <li><strong>咳嗽</strong>：ACEI类降压药常见，可咨询医生换用ARB类</li>
                    <li><strong>皮疹、瘙痒</strong>：可能是药物过敏，应立即停药并就医</li>
                </ul>
                <p><strong>严重不良反应（需立即就医）：</strong></p>
                <ul>
                    <li>呼吸困难、面部肿胀（严重过敏）</li>
                    <li>严重皮疹、水疱</li>
                    <li>不明原因的出血</li>
                    <li>黄疸、尿色变深</li>
                </ul>
                <p>建议将不适情况记录在复诊时告知医生。</p>`
        },
        {
            title: "如何正确存储药物？",
            tags: ["药物存储", "药品管理"],
            content: `<p>正确存储药物可以确保药效和安全性：</p>
                <ul>
                    <li><strong>常温保存</strong>：多数药物在15-25℃保存，避免阳光直射</li>
                    <li><strong>冷藏保存</strong>：部分生物制剂、胰岛素需2-8℃冷藏，不可冷冻</li>
                    <li><strong>干燥环境</strong>：避免放在浴室等潮湿处</li>
                    <li><strong>原包装保存</strong>：保留药品说明书，不要随意更换容器</li>
                    <li><strong>远离儿童</strong>：放在儿童无法触及的地方</li>
                </ul>
                <p><strong>定期清理药箱：</strong></p>
                <ul>
                    <li>每3个月检查一次药品有效期</li>
                    <li>过期药物不要直接扔进垃圾桶，应送到指定回收点</li>
                    <li>性状改变的药品（变色、发霉、异味）应立即丢弃</li>
                </ul>`
        },
        {
            title: "复诊前需要做哪些准备？",
            tags: ["复诊", "就医指南"],
            content: `<p>充分的复诊准备有助于医生更好地评估您的病情：</p>
                <p><strong>建议准备：</strong></p>
                <ul>
                    <li><strong>血压/血糖记录</strong>：带上近期的监测数据</li>
                    <li><strong>用药清单</strong>：列出正在服用的所有药物（含保健品）</li>
                    <li><strong>问题清单</strong>：写下想咨询医生的问题</li>
                    <li><strong>不适记录</strong>：记录近期的不适症状、持续时间</li>
                    <li><strong>检查报告</strong>：带上以往的化验单、影像报告</li>
                </ul>
                <p><strong>特别提醒：</strong></p>
                <ul>
                    <li>部分检查需要空腹，复诊前确认是否需要空腹</li>
                    <li>正常服用日常药物，不要因复诊而自行停药（除非医生特别嘱咐）</li>
                </ul>
                <p>使用本应用的复诊管理功能，可设置提醒帮您提前做好准备。</p>`
        }
    ]
};

// 初始化知识库
function initKnowledgeBase() {
    renderKnowledgeSection('knowledgeCommon', knowledgeData.common);
    renderKnowledgeSection('knowledgeInteraction', knowledgeData.interaction);
    renderKnowledgeSection('knowledgeFaq', knowledgeData.faq);
}

// 渲染知识库条目
function renderKnowledgeSection(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map((item, index) => `
        <div class="knowledge-item" data-index="${index}">
            <div class="knowledge-header" onclick="toggleKnowledgeItem(this)">
                <h4>${item.title}</h4>
                <span class="knowledge-arrow">&#9660;</span>
            </div>
            <div class="knowledge-body">
                <div class="tags">
                    ${item.tags.map(tag => `<span class="knowledge-tag">${tag}</span>`).join('')}
                </div>
                ${item.content}
            </div>
        </div>
    `).join('');
}

// 展开/收起知识库条目
function toggleKnowledgeItem(header) {
    const item = header.parentElement;
    item.classList.toggle('open');
}
