// mock/modules/news.js - 新闻Mock数据

// 生成相对时间
function getRelativeTime(daysAgo = 0) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().replace('T', ' ').substring(0, 19)
}

// 新闻列表数据
export function getNewsList() {
  return {
    list: [
      {
        id: 1,
        title: '关于开展2024年春季学期开学工作的通知',
        summary: '根据学校工作安排，现将2024年春季学期开学工作有关事项通知如下：一、开学时间安排...',
        cover: '/static/images/news1.jpg',
        tag: '通知',
        category: 'notice',
        source: '校办',
        author: '校长办公室',
        publishTime: getRelativeTime(365),
        viewCount: 1250,
        likeCount: 86,
        commentCount: 24,
        pinned: true,
        hot: false,
        new: false,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: false
      },
      {
        id: 2,
        title: '人工智能实验室获国家级重点项目支持',
        summary: '我校人工智能实验室近日获得国家自然科学基金重点项目支持，项目总经费达500万元...',
        cover: '/static/images/news2.jpg',
        tag: '科研',
        category: 'academic',
        source: '科研处',
        author: '科研处',
        publishTime: getRelativeTime(2),
        viewCount: 3250,
        likeCount: 156,
        commentCount: 48,
        pinned: false,
        hot: true,
        new: true,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: false
      },
      {
        id: 3,
        title: '2024年春季校园招聘会即将开始',
        summary: '为促进毕业生就业，学校将于3月15日举办2024年春季校园招聘会，届时将有200余家企业参加...',
        cover: '/static/images/news3.jpg',
        tag: '招聘',
        category: 'activity',
        source: '就业指导中心',
        author: '就业指导中心',
        publishTime: getRelativeTime(5),
        viewCount: 2156,
        likeCount: 98,
        commentCount: 32,
        pinned: false,
        hot: true,
        new: false,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: true,
        isJoined: false
      },
      {
        id: 4,
        title: '关于2024年度奖学金评选工作的通知',
        summary: '根据学校奖学金评选办法，现启动2024年度奖学金评选工作，请各学院按照要求组织申报...',
        cover: '/static/images/news4.jpg',
        tag: '通知',
        category: 'notice',
        source: '学生处',
        author: '学生处',
        publishTime: getRelativeTime(7),
        viewCount: 1890,
        likeCount: 72,
        commentCount: 28,
        pinned: true,
        hot: false,
        new: false,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: false
      },
      {
        id: 5,
        title: '校园文化艺术节系列活动启动',
        summary: '为丰富校园文化生活，提升学生艺术素养，学校将举办2024年校园文化艺术节，包含音乐会、话剧、书画展等多项活动...',
        cover: '/static/images/news5.jpg',
        tag: '活动',
        category: 'activity',
        source: '团委',
        author: '校团委',
        publishTime: getRelativeTime(3),
        viewCount: 1650,
        likeCount: 124,
        commentCount: 45,
        pinned: false,
        hot: true,
        new: true,
        liked: false,
        favorited: false,
        video: true,
        enableJoin: true,
        isJoined: false
      },
      {
        id: 6,
        title: '关于调整2024年春季学期课程安排的通知',
        summary: '因教学需要，现对2024年春季学期部分课程安排进行调整，请相关师生注意查看最新课表...',
        cover: '/static/images/news6.jpg',
        tag: '通知',
        category: 'notice',
        source: '教务处',
        author: '教务处',
        publishTime: getRelativeTime(1),
        viewCount: 2890,
        likeCount: 45,
        commentCount: 18,
        pinned: false,
        hot: false,
        new: true,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: false
      },
      {
        id: 7,
        title: '我校科研成果在国际顶级期刊发表',
        summary: '我校材料科学学院研究团队的最新研究成果在国际顶级期刊《Nature》上发表，这是我校首次在该期刊发表论文...',
        cover: '/static/images/news7.jpg',
        tag: '科研',
        category: 'academic',
        source: '科研处',
        author: '科研处',
        publishTime: getRelativeTime(10),
        viewCount: 4560,
        likeCount: 289,
        commentCount: 67,
        pinned: false,
        hot: true,
        new: false,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: false
      },
      {
        id: 8,
        title: '2024年学生社团招新活动开始',
        summary: '新学期开始，各学生社团开始招新，欢迎同学们根据自己的兴趣爱好选择加入合适的社团...',
        cover: '/static/images/news8.jpg',
        tag: '活动',
        category: 'activity',
        source: '团委',
        author: '校团委',
        publishTime: getRelativeTime(0),
        viewCount: 1230,
        likeCount: 67,
        commentCount: 25,
        pinned: false,
        hot: false,
        new: true,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: true,
        isJoined: false
      },
      {
        id: 9,
        title: '关于2024年春季学期选课的通知',
        summary: '2024年春季学期选课系统将于3月1日开放，请同学们及时登录系统进行选课，选课时间截止到3月10日...',
        cover: '/static/images/news9.jpg',
        tag: '通知',
        category: 'notice',
        source: '教务处',
        author: '教务处',
        publishTime: getRelativeTime(4),
        viewCount: 3450,
        likeCount: 89,
        commentCount: 35,
        pinned: true,
        hot: false,
        new: false,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: false
      },
      {
        id: 10,
        title: '校园安全知识讲座成功举办',
        summary: '为提高学生安全意识，学校举办了校园安全知识讲座，邀请了公安部门专家进行讲解，现场座无虚席...',
        cover: '/static/images/news10.jpg',
        tag: '活动',
        category: 'activity',
        source: '保卫处',
        author: '保卫处',
        publishTime: getRelativeTime(6),
        viewCount: 980,
        likeCount: 34,
        commentCount: 12,
        pinned: false,
        hot: false,
        new: false,
        liked: false,
        favorited: false,
        video: false,
        enableJoin: false
      }
    ],
    total: 10,
    page: 1,
    pageSize: 10,
    hasMore: false
  }
}

// 热门新闻
export function getHotNews() {
  return {
    list: [
      {
        id: 2,
        title: '人工智能实验室获国家级重点项目支持',
        cover: '/static/images/news2.jpg',
        tag: '科研',
        viewCount: 3250,
        commentCount: 48,
        hot: true
      },
      {
        id: 3,
        title: '2024年春季校园招聘会即将开始',
        cover: '/static/images/news3.jpg',
        tag: '招聘',
        viewCount: 2156,
        commentCount: 32,
        hot: true,
        video: false
      },
      {
        id: 5,
        title: '校园文化艺术节系列活动启动',
        cover: '/static/images/news5.jpg',
        tag: '活动',
        viewCount: 1650,
        commentCount: 45,
        hot: true,
        video: true
      },
      {
        id: 7,
        title: '我校科研成果在国际顶级期刊发表',
        cover: '/static/images/news7.jpg',
        tag: '科研',
        viewCount: 4560,
        commentCount: 67,
        hot: true
      }
    ]
  }
}

// 置顶新闻
export function getPinnedNews() {
  return {
    list: [
      {
        id: 1,
        title: '关于开展2024年春季学期开学工作的通知',
        cover: '/static/images/news1.jpg',
        tag: '通知',
        source: '校办',
        publishTime: getRelativeTime(365),
        pinned: true
      },
      {
        id: 4,
        title: '关于2024年度奖学金评选工作的通知',
        cover: '/static/images/news4.jpg',
        tag: '通知',
        source: '学生处',
        publishTime: getRelativeTime(7),
        pinned: true
      },
      {
        id: 9,
        title: '关于2024年春季学期选课的通知',
        cover: '/static/images/news9.jpg',
        tag: '通知',
        source: '教务处',
        publishTime: getRelativeTime(4),
        pinned: true
      }
    ]
  }
}

// 今日要闻
export function getTodayNews() {
  return {
    list: [
      {
        id: 2,
        title: '人工智能实验室获国家级重点项目支持',
        cover: '/static/images/news2.jpg',
        tag: '科研',
        source: '科研处',
        publishTime: getRelativeTime(2)
      },
      {
        id: 5,
        title: '校园文化艺术节系列活动启动',
        cover: '/static/images/news5.jpg',
        tag: '活动',
        source: '团委',
        publishTime: getRelativeTime(3)
      },
      {
        id: 8,
        title: '2024年学生社团招新活动开始',
        cover: '/static/images/news8.jpg',
        tag: '活动',
        source: '团委',
        publishTime: getRelativeTime(0)
      }
    ]
  }
}

// 新闻详情
export function getNewsDetail(id = 1) {
  const details = {
    1: {
      id: 1,
      title: '关于开展2024年春季学期开学工作的通知',
      cover: '/static/images/news1.jpg',
      category: 'notice',
      tag: '通知',
      source: '校办',
      author: '校长办公室',
      publishTime: getRelativeTime(365),
      content: `
        <h2>关于开展2024年春季学期开学工作的通知</h2>
        <p>各学院、各部门：</p>
        <p>根据学校工作安排，现将2024年春季学期开学工作有关事项通知如下：</p>
        
        <h3>一、开学时间安排</h3>
        <p>1. 学生报到时间：2024年3月1日（星期五）至3月2日（星期六）</p>
        <p>2. 正式上课时间：2024年3月4日（星期一）</p>
        <p>3. 教职工上班时间：2024年2月28日（星期三）</p>
        
        <h3>二、疫情防控要求</h3>
        <p>1. 所有师生需在返校前完成健康监测，如实填写健康信息表</p>
        <p>2. 来自中高风险地区师生需持48小时内核酸检测阴性证明</p>
        <p>3. 返校途中做好个人防护，佩戴口罩，保持社交距离</p>
        <p>4. 入校时配合体温检测和健康码查验</p>
        
        <h3>三、教学准备工作</h3>
        <p>1. 各学院做好课程安排和教师配备工作</p>
        <p>2. 实验设备检查维护，确保教学设施正常运行</p>
        <p>3. 教材发放工作提前准备，确保学生及时领取</p>
        <p>4. 在线教学平台测试，做好线上线下教学衔接</p>
        
        <h3>四、学生管理服务</h3>
        <p>1. 宿舍清洁消毒，营造安全舒适的住宿环境</p>
        <p>2. 食堂餐饮保障，确保食品安全和营养均衡</p>
        <p>3. 心理健康咨询服务，帮助学生适应新学期生活</p>
        <p>4. 图书馆、体育馆等公共设施正常开放</p>
        
        <p>请各学院、各部门高度重视，认真组织落实，确保开学工作顺利进行。</p>
        <p style="text-align: right; margin-top: 30px;">校长办公室<br>2024年2月20日</p>
      `,
      viewCount: 1250,
      likeCount: 86,
      commentCount: 24,
      isTop: true,
      isHot: false,
      isNew: false,
      isFeatured: false,
      pinned: true,
      imageCount: 1,
      wordCount: 850
    },
    2: {
      id: 2,
      title: '人工智能实验室获国家级重点项目支持',
      cover: '/static/images/news2.jpg',
      category: 'academic',
      tag: '科研',
      source: '科研处',
      author: '科研处',
      publishTime: getRelativeTime(2),
      content: `
        <h2>人工智能实验室获国家级重点项目支持</h2>
        <p>近日，国家自然科学基金委员会公布了2024年度重点项目立项结果，我校人工智能实验室申报的"基于深度学习的智能医疗诊断系统研究"项目成功获批，资助经费500万元。</p>
        
        <h3>项目简介</h3>
        <p>该项目由计算机学院李华教授团队牵头，联合医学院、附属医院共同开展，研究周期为4年（2024-2027）。项目旨在开发新一代智能医疗诊断系统，提高疾病早期诊断准确率，降低误诊率，为患者提供更精准的医疗服务。</p>
        
        <h3>研究内容</h3>
        <p>1. <strong>多模态医学影像分析算法</strong>：融合CT、MRI、X光等多种医学影像数据，构建深度学习模型，实现病灶自动识别和定位。</p>
        <p>2. <strong>临床数据融合与特征提取</strong>：整合患者病史、检验报告、基因信息等多源数据，提取关键特征，辅助诊断决策。</p>
        <p>3. <strong>可解释性人工智能模型</strong>：开发可解释的AI诊断模型，让医生理解AI的决策过程，提高临床应用的信任度。</p>
        <p>4. <strong>系统集成与应用验证</strong>：构建完整的智能诊断系统，在多家医院进行临床验证，评估系统性能和实用性。</p>
        
        <h3>预期成果</h3>
        <p>• 发表SCI论文10-15篇，其中顶级期刊论文3-5篇</p>
        <p>• 申请发明专利5-8项，软件著作权2-3项</p>
        <p>• 培养博士研究生5-8名，硕士研究生15-20名</p>
        <p>• 开发原型系统1套，在3-5家医院进行试点应用</p>
        
        <h3>项目意义</h3>
        <p>该项目的实施将提升我校在人工智能医疗领域的核心竞争力，推动产学研深度融合，为我国智慧医疗发展贡献力量。同时，项目成果有望在临床实践中推广应用，惠及更多患者。</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #1890ff; margin: 20px 0;">
          <p style="font-style: italic; margin: 0;">"这是我校在人工智能领域获得的最重要项目之一，体现了我们在这个方向的深厚积累。我们将全力以赴，确保项目高质量完成，为学校争光，为国家医疗事业发展贡献力量。"</p>
          <p style="text-align: right; margin: 10px 0 0 0;">——项目负责人李华教授</p>
        </div>
      `,
      viewCount: 3250,
      likeCount: 156,
      commentCount: 48,
      isTop: false,
      isHot: true,
      isNew: true,
      isFeatured: true,
      pinned: false,
      hot: true,
      new: true,
      imageCount: 3,
      wordCount: 1200
    },
    3: {
      id: 3,
      title: '2024年春季校园招聘会即将开始',
      cover: '/static/images/news3.jpg',
      category: 'activity',
      tag: '招聘',
      source: '就业指导中心',
      author: '就业指导中心',
      publishTime: getRelativeTime(5),
      content: `
        <h2>2024年春季校园招聘会即将开始</h2>
        <p>为促进毕业生高质量就业，学校将于3月15-17日举办2024年春季校园招聘会，届时将有华为、腾讯、阿里巴巴、百度、京东等300余家知名企业参会，提供5000+优质岗位。</p>
        
        <h3>招聘会安排</h3>
        <p><strong>时间：</strong>2024年3月15日-17日（周五至周日）</p>
        <p><strong>地点：</strong>学校体育馆主会场、各学院分会场</p>
        <p><strong>参会企业：</strong>300+家知名企业</p>
        <p><strong>提供岗位：</strong>5000+个优质岗位</p>
        
        <h3>参会企业类型</h3>
        <p>1. <strong>互联网科技类</strong>：华为、腾讯、阿里巴巴、百度、京东、字节跳动、美团、滴滴等</p>
        <p>2. <strong>金融类</strong>：中国银行、工商银行、建设银行、招商银行、平安集团等</p>
        <p>3. <strong>制造业类</strong>：比亚迪、宁德时代、三一重工、中车集团等</p>
        <p>4. <strong>教育类</strong>：新东方、好未来、学而思等知名教育机构</p>
        <p>5. <strong>其他行业</strong>：涵盖房地产、快消、医药、能源等多个领域</p>
        
        <h3>岗位需求</h3>
        <p>本次招聘会涵盖计算机、软件工程、人工智能、金融、管理、市场营销、人力资源、财务、设计等多个专业方向，既有技术研发岗位，也有管理、销售、运营等综合类岗位，满足不同专业背景毕业生的就业需求。</p>
        
        <h3>参会须知</h3>
        <p>1. 请提前登录就业指导中心官网查看企业信息和岗位详情</p>
        <p>2. 准备好个人简历、成绩单、获奖证书等相关材料</p>
        <p>3. 建议提前了解目标企业的文化和岗位要求</p>
        <p>4. 注意着装得体，保持良好的精神面貌</p>
        <p>5. 遵守会场秩序，文明参会</p>
        
        <h3>报名方式</h3>
        <p>有意参加的同学请于3月10日前登录就业指导中心官网进行报名，或关注"校园就业"微信公众号获取最新信息。</p>
        
        <p style="color: #ff4d4f; font-weight: bold;">报名截止时间：2024年3月10日24:00</p>
      `,
      viewCount: 2156,
      likeCount: 98,
      commentCount: 32,
      isTop: false,
      isHot: true,
      isNew: false,
      isFeatured: false,
      pinned: false,
      hot: true,
      enableJoin: true,
      isJoined: false,
      imageCount: 2,
      wordCount: 980
    },
    4: {
      id: 4,
      title: '关于2024年度奖学金评选工作的通知',
      cover: '/static/images/news4.jpg',
      category: 'notice',
      tag: '通知',
      source: '学生处',
      author: '学生处',
      publishTime: getRelativeTime(7),
      content: `
        <h2>关于2024年度国家奖学金、励志奖学金评选工作的通知</h2>
        <p>各学院：</p>
        <p>根据教育部和学校相关规定，现启动2024年度国家奖学金、国家励志奖学金评选工作，请各学院按照公平、公正、公开原则组织申报。</p>
        
        <h3>一、评选对象</h3>
        <p>1. <strong>国家奖学金</strong>：全日制在校本科生中特别优秀的学生</p>
        <p>2. <strong>国家励志奖学金</strong>：全日制在校本科生中品学兼优的家庭经济困难学生</p>
        
        <h3>二、评选条件</h3>
        <p><strong>国家奖学金申请条件：</strong></p>
        <p>1. 热爱社会主义祖国，拥护中国共产党的领导</p>
        <p>2. 遵守宪法和法律，遵守学校规章制度</p>
        <p>3. 诚实守信，道德品质优良</p>
        <p>4. 在校期间学习成绩优异，社会实践、创新能力、综合素质等方面特别突出</p>
        <p>5. 学习成绩排名与综合考评成绩排名均位于前10%（含10%）</p>
        
        <p><strong>国家励志奖学金申请条件：</strong></p>
        <p>1. 符合国家奖学金申请条件1-3条</p>
        <p>2. 家庭经济困难，生活俭朴</p>
        <p>3. 学习成绩优秀，学习成绩排名与综合考评成绩排名均位于前30%（含30%）</p>
        
        <h3>三、奖励标准</h3>
        <p>• 国家奖学金：8000元/人</p>
        <p>• 国家励志奖学金：5000元/人</p>
        
        <h3>四、评选程序</h3>
        <p>1. 学生申请（3月1日-3月10日）</p>
        <p>2. 学院初评（3月11日-3月20日）</p>
        <p>3. 学校评审（3月21日-3月31日）</p>
        <p>4. 公示（4月1日-4月7日）</p>
        <p>5. 上报教育部（4月10日前）</p>
        
        <h3>五、材料要求</h3>
        <p>1. 《国家奖学金申请审批表》或《国家励志奖学金申请审批表》</p>
        <p>2. 学习成绩单（加盖学院公章）</p>
        <p>3. 获奖证书复印件</p>
        <p>4. 其他支撑材料</p>
        
        <p>请各学院高度重视，严格按照评选条件和程序，认真做好评选工作。</p>
        <p style="text-align: right; margin-top: 30px;">学生处<br>2024年2月25日</p>
      `,
      viewCount: 1890,
      likeCount: 72,
      commentCount: 28,
      isTop: true,
      isHot: false,
      isNew: false,
      isFeatured: false,
      pinned: true,
      imageCount: 1,
      wordCount: 920
    },
    5: {
      id: 5,
      title: '校园文化艺术节系列活动启动',
      cover: '/static/images/news5.jpg',
      category: 'activity',
      tag: '活动',
      source: '团委',
      author: '校团委',
      publishTime: getRelativeTime(3),
      content: `
        <h2>校园文化艺术节盛大开幕，百场活动等你来参与</h2>
        <p>为丰富校园文化生活，提升学生艺术素养，学校将举办为期一个月的校园文化艺术节，包含音乐会、话剧展演、书画大赛、摄影展等百余场精彩活动。</p>
        
        <h3>活动主题</h3>
        <p style="font-size: 18px; color: #1890ff; font-weight: bold;">"青春飞扬，艺彩纷呈"</p>
        
        <h3>活动时间</h3>
        <p>2024年3月1日-3月31日</p>
        
        <h3>主要活动安排</h3>
        <p><strong>1. 开幕式音乐会（3月1日）</strong></p>
        <p>地点：学校大礼堂</p>
        <p>内容：交响乐、民乐、合唱等精彩演出</p>
        
        <p><strong>2. 话剧展演周（3月5日-12日）</strong></p>
        <p>地点：各学院小剧场</p>
        <p>内容：经典话剧、原创话剧、即兴表演等</p>
        
        <p><strong>3. 书画大赛（3月8日-15日）</strong></p>
        <p>地点：艺术楼展厅</p>
        <p>内容：书法、国画、油画、水彩画等作品征集和展览</p>
        
        <p><strong>4. 摄影展（3月10日-20日）</strong></p>
        <p>地点：图书馆一楼展厅</p>
        <p>内容：校园风光、人物肖像、纪实摄影等</p>
        
        <p><strong>5. 舞蹈大赛（3月15日）</strong></p>
        <p>地点：体育馆</p>
        <p>内容：民族舞、现代舞、街舞等各类舞蹈比赛</p>
        
        <p><strong>6. 校园歌手大赛（3月20日）</strong></p>
        <p>地点：音乐厅</p>
        <p>内容：流行、民谣、摇滚等多种音乐风格</p>
        
        <p><strong>7. 闭幕式晚会（3月31日）</strong></p>
        <p>地点：学校大礼堂</p>
        <p>内容：优秀节目汇演、颁奖典礼</p>
        
        <h3>参与方式</h3>
        <p>1. 关注"校园文化艺术节"官方微信公众号</p>
        <p>2. 登录活动报名系统进行在线报名</p>
        <p>3. 各学院学生会现场报名</p>
        
        <h3>奖项设置</h3>
        <p>• 各类比赛设一、二、三等奖及优秀奖</p>
        <p>• 优秀作品将在学校官方平台展示</p>
        <p>• 获奖者将获得荣誉证书和精美奖品</p>
        
        <p style="color: #52c41a; font-weight: bold;">欢迎全校师生积极参与，共同打造精彩纷呈的校园文化盛宴！</p>
      `,
      viewCount: 1650,
      likeCount: 124,
      commentCount: 45,
      isTop: false,
      isHot: true,
      isNew: true,
      isFeatured: false,
      pinned: false,
      hot: true,
      new: true,
      video: true,
      enableJoin: true,
      isJoined: false,
      imageCount: 4,
      wordCount: 1100
    },
    6: {
      id: 6,
      title: '关于调整2024年春季学期课程安排的通知',
      cover: '/static/images/news6.jpg',
      category: 'notice',
      tag: '通知',
      source: '教务处',
      author: '教务处',
      publishTime: getRelativeTime(1),
      content: `
        <h2>关于调整2024年春季学期课程安排的重要通知</h2>
        <p>各学院、各位同学：</p>
        <p>因教学资源优化配置需要，现对2024年春季学期部分课程时间、教室进行调整，请相关师生及时登录教务系统查看最新课表安排。</p>
        
        <h3>一、调整范围</h3>
        <p>本次调整涉及以下课程：</p>
        <p>1. 计算机学院《数据结构与算法》课程</p>
        <p>2. 商学院《管理学原理》课程</p>
        <p>3. 外语学院《大学英语（三）》课程</p>
        <p>4. 其他部分公共选修课程</p>
        
        <h3>二、调整内容</h3>
        <p><strong>时间调整：</strong></p>
        <p>• 《数据结构与算法》：原周一3-4节调整为周二3-4节</p>
        <p>• 《管理学原理》：原周三5-6节调整为周四5-6节</p>
        <p>• 《大学英语（三）》：原周五1-2节调整为周五3-4节</p>
        
        <p><strong>教室调整：</strong></p>
        <p>• 部分课程教室由原教学楼调整至新教学楼</p>
        <p>• 具体教室信息请查看教务系统</p>
        
        <h3>三、查询方式</h3>
        <p>1. 登录教务管理系统（http://jwxt.university.edu.cn）</p>
        <p>2. 进入"我的课表"查看最新安排</p>
        <p>3. 关注教务处官方微信公众号获取推送通知</p>
        <p>4. 各学院教学秘书处咨询</p>
        
        <h3>四、注意事项</h3>
        <p>1. 请相关师生务必及时查看并确认新的课程安排</p>
        <p>2. 如有冲突或疑问，请及时联系所在学院教学秘书</p>
        <p>3. 调整后的课程安排自3月4日起正式执行</p>
        <p>4. 请同学们合理安排时间，避免课程冲突</p>
        
        <p style="color: #ff4d4f; font-weight: bold;">重要提示：本次调整涉及面较广，请务必及时查看最新课表，以免影响正常上课！</p>
        
        <p style="text-align: right; margin-top: 30px;">教务处<br>2024年2月28日</p>
      `,
      viewCount: 2890,
      likeCount: 45,
      commentCount: 18,
      isTop: false,
      isHot: false,
      isNew: true,
      isFeatured: false,
      pinned: false,
      new: true,
      imageCount: 1,
      wordCount: 880
    },
    7: {
      id: 7,
      title: '我校科研成果在国际顶级期刊发表',
      cover: '/static/images/news7.jpg',
      category: 'academic',
      tag: '科研',
      source: '科研处',
      author: '科研处',
      publishTime: getRelativeTime(10),
      content: `
        <h2>我校科研成果在国际顶级期刊《Nature》发表，实现历史性突破</h2>
        <p>我校材料科学学院研究团队在新型纳米材料领域取得重大突破，研究成果在国际顶级期刊《Nature》上发表，影响因子达49.962。这是我校首次在该期刊发表论文，标志着我校科研水平达到国际一流。</p>
        
        <h3>研究成果</h3>
        <p>该研究由材料科学学院张伟教授团队完成，论文题目为"基于二维材料的超高效太阳能电池研究"。研究团队开发了一种新型二维纳米材料，能够显著提高太阳能电池的光电转换效率，转换效率达到28.5%，创下同类材料的世界纪录。</p>
        
        <h3>研究意义</h3>
        <p>1. <strong>理论突破</strong>：首次揭示了二维材料在太阳能转换中的新机制，为相关领域研究提供了新思路</p>
        <p>2. <strong>技术应用</strong>：研究成果有望在光伏产业中应用，推动清洁能源发展</p>
        <p>3. <strong>国际影响</strong>：提升了学校在国际学术界的知名度和影响力</p>
        
        <h3>研究团队</h3>
        <p>该研究由张伟教授领衔，团队成员包括：</p>
        <p>• 张伟教授（第一作者、通讯作者）</p>
        <p>• 李华副教授（共同第一作者）</p>
        <p>• 王明博士（主要贡献者）</p>
        <p>• 其他团队成员和合作者</p>
        
        <h3>研究历程</h3>
        <p>该研究历时5年，经历了材料设计、制备、表征、性能测试等多个阶段。研究过程中克服了诸多技术难题，最终取得了突破性成果。论文经过严格的同行评议，获得了审稿专家的一致好评。</p>
        
        <h3>后续计划</h3>
        <p>研究团队将继续深入探索，推动研究成果的产业化应用，同时培养更多优秀科研人才，为学校和国家科技发展做出更大贡献。</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #52c41a; margin: 20px 0;">
          <p style="font-style: italic; margin: 0;">"这是我校科研历史上的重要里程碑，体现了我们在材料科学领域的深厚实力。我们将继续努力，争取取得更多突破性成果。"</p>
          <p style="text-align: right; margin: 10px 0 0 0;">——张伟教授</p>
        </div>
      `,
      viewCount: 4560,
      likeCount: 289,
      commentCount: 67,
      isTop: false,
      isHot: true,
      isNew: false,
      isFeatured: true,
      pinned: false,
      hot: true,
      imageCount: 5,
      wordCount: 1050
    },
    8: {
      id: 8,
      title: '2024年学生社团招新活动开始',
      cover: '/static/images/news8.jpg',
      category: 'activity',
      tag: '活动',
      source: '团委',
      author: '校团委',
      publishTime: getRelativeTime(0),
      content: `
        <h2>百团大战！2024年学生社团招新活动火热进行中</h2>
        <p>新学期伊始，学校百余个学生社团开启招新活动，涵盖学术科技、文化艺术、体育健身、公益服务等各类别，期待你的加入！</p>
        
        <h3>招新时间</h3>
        <p>2024年3月1日-3月15日</p>
        
        <h3>招新地点</h3>
        <p>• 主会场：学校中心广场</p>
        <p>• 各学院分会场：各学院教学楼前</p>
        
        <h3>社团类别</h3>
        <p><strong>1. 学术科技类（30+个社团）</strong></p>
        <p>计算机协会、数学建模协会、机器人协会、电子设计协会、创新创业协会等</p>
        
        <p><strong>2. 文化艺术类（25+个社团）</strong></p>
        <p>书法协会、绘画协会、摄影协会、音乐协会、舞蹈协会、话剧社、文学社等</p>
        
        <p><strong>3. 体育健身类（20+个社团）</strong></p>
        <p>篮球协会、足球协会、羽毛球协会、乒乓球协会、武术协会、瑜伽协会等</p>
        
        <p><strong>4. 公益服务类（15+个社团）</strong></p>
        <p>青年志愿者协会、环保协会、爱心社、支教协会等</p>
        
        <p><strong>5. 其他类别（10+个社团）</strong></p>
        <p>辩论社、棋类协会、动漫社、美食协会等</p>
        
        <h3>招新亮点</h3>
        <p>1. <strong>现场体验</strong>：各社团设置体验区，可以现场体验社团活动</p>
        <p>2. <strong>才艺展示</strong>：社团成员现场表演，展示社团风采</p>
        <p>3. <strong>互动游戏</strong>：参与互动游戏，赢取精美礼品</p>
        <p>4. <strong>线上报名</strong>：扫描二维码即可在线报名</p>
        
        <h3>报名方式</h3>
        <p>1. <strong>现场报名</strong>：在招新现场填写报名表</p>
        <p>2. <strong>线上报名</strong>：关注"校园社团"微信公众号，在线报名</p>
        <p>3. <strong>社团咨询</strong>：直接联系各社团负责人</p>
        
        <h3>加入社团的好处</h3>
        <p>• 发展兴趣爱好，丰富课余生活</p>
        <p>• 结交志同道合的朋友</p>
        <p>• 提升综合素质和能力</p>
        <p>• 参与各类活动和比赛</p>
        <p>• 获得社会实践经验</p>
        
        <p style="color: #1890ff; font-weight: bold; font-size: 18px;">青春正当时，社团等你来！快来加入你心仪的社团吧！</p>
      `,
      viewCount: 1230,
      likeCount: 67,
      commentCount: 25,
      isTop: false,
      isHot: false,
      isNew: true,
      isFeatured: false,
      pinned: false,
      new: true,
      enableJoin: true,
      isJoined: false,
      imageCount: 3,
      wordCount: 950
    },
    9: {
      id: 9,
      title: '关于2024年春季学期选课的通知',
      cover: '/static/images/news9.jpg',
      category: 'notice',
      tag: '通知',
      source: '教务处',
      author: '教务处',
      publishTime: getRelativeTime(4),
      content: `
        <h2>2024年春季学期选课指南及注意事项</h2>
        <p>各位同学：</p>
        <p>2024年春季学期选课系统将于3月1日9:00开放，采取分年级分时段选课方式，请同学们仔细阅读选课指南，合理安排选课计划。</p>
        
        <h3>一、选课时间安排</h3>
        <p><strong>第一阶段：预选（3月1日9:00-3月5日17:00）</strong></p>
        <p>• 大三、大四学生：3月1日9:00-3月2日17:00</p>
        <p>• 大二学生：3月3日9:00-3月4日17:00</p>
        <p>• 大一学生：3月5日9:00-17:00</p>
        
        <p><strong>第二阶段：正选（3月6日9:00-3月10日17:00）</strong></p>
        <p>所有年级学生均可选课，先到先得</p>
        
        <p><strong>第三阶段：补选（3月11日9:00-3月15日17:00）</strong></p>
        <p>针对未选满的课程进行补选</p>
        
        <h3>二、选课系统</h3>
        <p>1. 登录地址：http://jwxt.university.edu.cn</p>
        <p>2. 用户名：学号</p>
        <p>3. 初始密码：身份证后6位（首次登录需修改密码）</p>
        
        <h3>三、选课规则</h3>
        <p>1. <strong>必修课</strong>：系统自动预置，无需选择</p>
        <p>2. <strong>专业选修课</strong>：根据专业培养方案要求选择</p>
        <p>3. <strong>公共选修课</strong>：至少选择2门，最多选择4门</p>
        <p>4. <strong>体育课</strong>：每学期必须选择1门</p>
        <p>5. <strong>学分限制</strong>：每学期总学分不超过30学分</p>
        
        <h3>四、注意事项</h3>
        <p>1. 选课前请仔细查看课程信息、上课时间、任课教师等</p>
        <p>2. 注意课程时间冲突，避免选择时间重叠的课程</p>
        <p>3. 关注课程容量，热门课程可能很快选满</p>
        <p>4. 选课成功后请及时确认，避免误操作</p>
        <p>5. 如有问题，及时联系所在学院教学秘书或教务处</p>
        
        <h3>五、常见问题</h3>
        <p><strong>Q：选课系统无法登录怎么办？</strong></p>
        <p>A：检查网络连接，清除浏览器缓存，或联系信息中心（电话：010-12345678）</p>
        
        <p><strong>Q：课程选满了怎么办？</strong></p>
        <p>A：可以关注是否有退选名额，或在补选阶段选择其他课程</p>
        
        <p><strong>Q：选错课程可以退选吗？</strong></p>
        <p>A：在选课期间可以退选，选课结束后需到教务处办理退选手续</p>
        
        <p style="color: #ff4d4f; font-weight: bold;">重要提醒：请务必在规定时间内完成选课，逾期不予补选！</p>
        
        <p style="text-align: right; margin-top: 30px;">教务处<br>2024年2月26日</p>
      `,
      viewCount: 3450,
      likeCount: 89,
      commentCount: 35,
      isTop: true,
      isHot: false,
      isNew: false,
      isFeatured: false,
      pinned: true,
      imageCount: 2,
      wordCount: 1020
    },
    10: {
      id: 10,
      title: '校园安全知识讲座成功举办',
      cover: '/static/images/news10.jpg',
      category: 'activity',
      tag: '活动',
      source: '保卫处',
      author: '保卫处',
      publishTime: getRelativeTime(6),
      content: `
        <h2>校园安全知识讲座成功举办，千名师生参与学习</h2>
        <p>为增强师生安全防范意识，提高自我保护能力，学校举办校园安全知识系列讲座，涵盖消防安全、网络安全、交通安全、食品安全等内容，现场互动热烈，取得了良好效果。</p>
        
        <h3>讲座内容</h3>
        <p><strong>1. 消防安全知识（3月5日）</strong></p>
        <p>• 火灾预防措施</p>
        <p>• 灭火器使用方法</p>
        <p>• 火场逃生技巧</p>
        <p>• 消防演练实操</p>
        
        <p><strong>2. 网络安全知识（3月6日）</strong></p>
        <p>• 网络诈骗防范</p>
        <p>• 个人信息保护</p>
        <p>• 网络购物安全</p>
        <p>• 网络借贷风险</p>
        
        <p><strong>3. 交通安全知识（3月7日）</strong></p>
        <p>• 交通规则遵守</p>
        <p>• 骑行安全注意事项</p>
        <p>• 交通事故处理</p>
        <p>• 安全出行建议</p>
        
        <p><strong>4. 食品安全知识（3月8日）</strong></p>
        <p>• 食品选购要点</p>
        <p>• 食品储存方法</p>
        <p>• 食物中毒预防</p>
        <p>• 健康饮食习惯</p>
        
        <h3>讲座特色</h3>
        <p>1. <strong>专家讲解</strong>：邀请公安、消防、食药监等部门专家进行专业讲解</p>
        <p>2. <strong>案例分享</strong>：通过真实案例，让师生深刻认识安全的重要性</p>
        <p>3. <strong>互动体验</strong>：设置互动环节，让师生亲身体验安全技能</p>
        <p>4. <strong>现场答疑</strong>：专家现场解答师生关心的安全问题</p>
        
        <h3>参与情况</h3>
        <p>本次系列讲座共吸引了1000+名师生参与，现场座无虚席，气氛热烈。师生们纷纷表示，通过讲座学到了很多实用的安全知识，提高了安全防范意识。</p>
        
        <h3>后续活动</h3>
        <p>学校将继续开展各类安全教育活动，包括：</p>
        <p>• 安全知识竞赛</p>
        <p>• 应急演练活动</p>
        <p>• 安全主题班会</p>
        <p>• 安全宣传周活动</p>
        
        <p style="color: #52c41a; font-weight: bold;">安全无小事，防范于未然。希望全体师生时刻保持安全意识，共同营造安全和谐的校园环境！</p>
      `,
      viewCount: 980,
      likeCount: 34,
      commentCount: 12,
      isTop: false,
      isHot: false,
      isNew: false,
      isFeatured: false,
      pinned: false,
      imageCount: 2,
      wordCount: 890
    }
  }
  
  // 如果请求的ID不在详情列表中，返回默认详情（ID为1的详情）
  const detail = details[id] || details[1]
  
  // 确保返回的数据包含所有必要字段
  return {
    ...detail,
    // 如果详情中没有某些字段，从列表数据中获取
    liked: detail.liked !== undefined ? detail.liked : false,
    favorited: detail.favorited !== undefined ? detail.favorited : false
  }
}

// 相关新闻
export function getRelatedNews(newsId = 1) {
  const relatedMap = {
    1: [2, 4, 6, 9],
    2: [1, 7, 3, 5]
  }
  
  const relatedIds = relatedMap[newsId] || [2, 3, 4, 5]
  
  return {
    list: relatedIds.map(id => ({
      id,
      title: `相关新闻标题 ${id}`,
      cover: `/static/images/news${id}.jpg`,
      publishTime: getRelativeTime(id),
      viewCount: 1000 + id * 100
    }))
  }
}

// 评论数据
export function getComments(newsId = 1) {
  return {
    list: [
      {
        id: 1,
        newsId: newsId,
        userId: 'user1',
        username: '张三',
        avatar: '/static/images/生成动物写实头像.png',
        content: '活动很精彩，希望以后多举办这样的活动！',
        createTime: '2024-03-15 12:30',
        likeCount: 15,
        replyCount: 0,
        liked: false,
        isHot: true,
        isAuthor: false,
        isTop: false,
        floor: 1
      },
      {
        id: 2,
        newsId: newsId,
        userId: 'user2',
        username: '李四',
        avatar: '/static/images/生成动物写实头像 (1).png',
        content: '赞！期待参加！',
        createTime: '2024-03-15 13:45',
        likeCount: 8,
        replyCount: 0,
        liked: false,
        isHot: false,
        isAuthor: false,
        isTop: false,
        floor: 2
      },
      {
        id: 3,
        newsId: newsId,
        userId: 'user3',
        username: '王五',
        avatar: '/static/images/生成动物写实头像 (2).png',
        content: '组织得很好，为学校点赞 👍',
        createTime: '2024-03-15 15:20',
        likeCount: 22,
        replyCount: 0,
        liked: false,
        isHot: false,
        isAuthor: false,
        isTop: false,
        floor: 3
      },
      {
        id: 4,
        newsId: newsId,
        userId: 'author1',
        username: '校长办公室',
        avatar: '/static/images/生成动物写实头像 (3).png',
        content: '感谢关注，我们会及时更新相关信息。',
        createTime: getRelativeTime(1),
        likeCount: 25,
        replyCount: 0,
        liked: false,
        isHot: true,
        isAuthor: true,
        isTop: false,
        floor: 3
      }
    ],
    stats: {
      total: 24,
      hot: 5,
      new: 15,
      author: 2
    },
    hasMore: false
  }
}

// 搜索历史
export function getSearchHistory() {
  return [
    '开学通知',
    '奖学金',
    '招聘会',
    '选课',
    '社团招新'
  ]
}

// 热搜榜
export function getHotSearch() {
  return [
    { id: 1, keyword: '开学通知', count: 1250, tag: { text: '热', type: 'hot' } },
    { id: 2, keyword: '人工智能', count: 980, tag: { text: '新', type: 'new' } },
    { id: 3, keyword: '校园招聘', count: 756, tag: null },
    { id: 4, keyword: '奖学金评选', count: 654, tag: null },
    { id: 5, keyword: '选课系统', count: 532, tag: null }
  ]
}

// 点赞新闻
export function likeNews(newsId) {
  const detail = getNewsDetail(newsId)
  if (detail) {
    detail.likeCount = (detail.likeCount || 0) + 1
    detail.liked = true
  }
  return {
    code: 200,
    message: '点赞成功',
    data: detail
  }
}

// 取消点赞新闻
export function unlikeNews(newsId) {
  const detail = getNewsDetail(newsId)
  if (detail) {
    detail.likeCount = Math.max(0, (detail.likeCount || 1) - 1)
    detail.liked = false
  }
  return {
    code: 200,
    message: '取消点赞成功',
    data: detail
  }
}

// 收藏新闻
export function favoriteNews(newsId) {
  return {
    code: 200,
    message: '收藏成功',
    data: { newsId, favorited: true }
  }
}

// 取消收藏新闻
export function unfavoriteNews(newsId) {
  return {
    code: 200,
    message: '取消收藏成功',
    data: { newsId, favorited: false }
  }
}

// 添加评论
export function addComment(data) {
  const { newsId, content, parentId, userId, username, avatar } = data
  
  // 系统头像列表
  const systemAvatars = [
    '/static/images/生成动物写实头像.png',
    '/static/images/生成动物写实头像 (1).png',
    '/static/images/生成动物写实头像 (2).png',
    '/static/images/生成动物写实头像 (3).png',
    '/static/images/生成动物写实头像 (4).png',
    '/static/images/生成动物写实头像 (5).png',
    '/static/images/生成动物写实头像 (6).png',
    '/static/images/生成动物写实头像 (7).png',
    '/static/images/生成动物写实头像 (8).png',
    '/static/images/生成动物写实头像 (9).png'
  ]
  
  // 根据 userId 选择头像（确保同一用户头像一致）
  let selectedAvatar = avatar
  if (!selectedAvatar && userId) {
    const index = parseInt(String(userId).replace(/\D/g, '')) || 0
    selectedAvatar = systemAvatars[index % systemAvatars.length]
  } else if (!selectedAvatar) {
    selectedAvatar = systemAvatars[Math.floor(Math.random() * systemAvatars.length)]
  }
  
  const newComment = {
    id: Date.now(),
    newsId: newsId,
    userId: userId || 'currentUser',
    username: username || '我',
    avatar: selectedAvatar,
    content: content,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    likeCount: 0,
    replyCount: 0,
    liked: false,
    isHot: false,
    isAuthor: false,
    isTop: false,
    floor: 1,
    parentId: parentId || null
  }
  
  return {
    code: 200,
    message: '评论成功',
    data: newComment
  }
}

// 点赞评论
export function likeComment(data) {
  const { commentId } = data
  return {
    code: 200,
    message: '点赞成功',
    data: { commentId, liked: true }
  }
}

// 取消点赞评论
export function unlikeComment(data) {
  const { commentId } = data
  return {
    code: 200,
    message: '取消点赞成功',
    data: { commentId, liked: false }
  }
}
