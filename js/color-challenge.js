const colorDisplay = document.getElementById('color-display');
const optionsContainer = document.getElementById('options');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const resultDisplay = document.getElementById('result');
const restartJudgement = document.getElementById('restart-judgement');

let judgementScore = 0;
let currentColor = '';
let judgementOptions = [];
let gameTimer;
let timeLeft = 60;
const FEEDBACK_DELAY = 320;

// 精选32种色气名词
const rawColorMap = {
    '奶白爱液':'#FFFAFA','处女膜粉':'#FFC1CC','潮红小穴':'#FF69B4','湿润樱唇':'#FF1493',
    '精液白浊':'#FFFFFF','黑丝深渊':'#000000','午夜蓝穴':'#191970','蓝色肉棒':'#0000FF',
    '天蓝淫液':'#87CEEB','青色潮吹':'#00FFFF','薄荷奶头':'#F5FFFA','春绿嫩肉':'#00FF7F',
    '酸橙绿棒':'#32CD32','黄色高潮':'#FFFF00','金色精液':'#FFD700','橙色爱液':'#FFA500',
    '珊瑚潮红':'#FF7F50','番茄红唇':'#FF6347','赤红肉壁':'#FF0000','艳粉小穴':'#FF69B4',
    '紫罗兰湿':'#EE82EE','洋红喷液':'#FF00FF','李子嫩肉':'#DDA0DD','深紫爱痕':'#9400D3',
    '栗色肉棒':'#800000','巧克力汁':'#D2691E','小麦乳汁':'#F5DEB3','鲑鱼潮红':'#FA8072',
    '玫瑰高潮':'#BC8F8F','猩红爱液':'#DC143C','橄榄嫩穴':'#808000','银色潮吹':'#C0C0C0'
};

const colorMap = {};
Object.keys(rawColorMap).forEach(k => {
    const key = k.trim();
    if (!key) return;
    colorMap[key] = rawColorMap[k];
});

const colorNames = Object.keys(colorMap);

function randomColor() {
    return colorNames[Math.floor(Math.random() * colorNames.length)];
}

function generateOptions(correct) {
    const opts = [correct];
    while (opts.length < 4) {
        const rand = randomColor();
        if (!opts.includes(rand)) opts.push(rand);
    }
    for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
}

function startJudgementRound() {
    if (timeLeft <= 0) return;
    currentColor = randomColor();
    colorDisplay.style.backgroundColor = colorMap[currentColor];
    colorDisplay.style.transform = 'scale(1.05)';

    judgementOptions = generateOptions(currentColor);
    optionsContainer.innerHTML = '';

    judgementOptions.forEach(name => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.addEventListener('click', () => checkJudgementAnswer(name, btn));
        optionsContainer.appendChild(btn);
    });

    setTimeout(() => {
        colorDisplay.style.transform = 'scale(1)';
    }, 200);
}

function checkJudgementAnswer(selected, btn) {
    if (btn.disabled || timeLeft <= 0) return;

    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);

    if (selected === currentColor) {
        btn.classList.add('correct');
        judgementScore++;
    } else {
        btn.classList.add('wrong');
        judgementScore = Math.max(0, judgementScore - 1);
        buttons.forEach(b => {
            if (b.textContent === currentColor) b.classList.add('correct');
        });
    }
    scoreDisplay.textContent = `得分：${judgementScore}`;

    setTimeout(() => {
        buttons.forEach(b => {
            b.disabled = false;
            b.className = '';
        });
        startJudgementRound();
    }, FEEDBACK_DELAY);
}

// 扩展评语库
const comments = {
    perfect: [
        '哼哼你这色鬼，眼睛比人家的小裤裤还尖！全看光光啦～下次要不要人家脱得更彻底点？( ω )',
        '呀！大哥哥好厉害！人家的小穴都被你看穿了呢～再来一次，人家要高潮到喷水哦！(〃￣ω￣〃ゞ',
        '呜哇你这变态！连人家最敏感的小豆豆都找得到？人家已经湿透啦！(////)',
        '嘻嘻你赢了！人家的小秘密全被你发现了～作为奖励，要不要舔舔人家的奶头？(ﾉ*ﾟｰﾟ)ﾉ',
        '啊啊你太棒了！人家要被你看化掉了～下次要不要试试用舌头找颜色？()',
        '哼你这大色狼！人家的小穴汁都被你猜出来了呢～人家好害羞哦！( >  < )',
        '呀呀好棒棒！人家的小豆豆都硬起来了，全是被你看出来的～(〃ﾉωﾉ)',
        '呜呜你赢啦！人家的小秘密都被你发现了～下次人家要穿更少的哦！(灬ºωº灬)'
    ],
    excellent: [
        '呀大哥哥好棒棒哦！人家的小秘密都被你发现了呢～再多摸摸，人家会更湿湿的哦？(〃￣ω￣〃)',
        '哼还不错嘛！人家的小颜色都被你舔出来了呢～继续加油，人家要高潮啦！(//ω//)',
        '嘻嘻你这色狼！连人家潮红的小穴都认得出来？再来一次，人家要夹紧你哦～(ﾉ з `)ノ',
        '呀！人家的小穴汁都被你看光了呢～再多猜对几题，人家就让你摸摸看！(灬º 艸º灬)',
        '呜你好坏！人家最敏感的地方都被你发现了～再来一次，人家要叫出声了！(〃〃)',
        '哼哼—不错哦！人家的小穴都湿成这样了你还猜对～人家要奖励你！(ㅅ)',
        '呀呀好厉害！人家的小豆豆都被你找出来了呢～人家好痒哦！( - )',
        '呜呜你这坏蛋！人家的小秘密都被你猜中了～下次人家要更难哦！(〃ﾉωﾉ)'
    ],
    good: [
        '嘻嘻还不错嘛！人家的小颜色都被你舔出来了呢～继续加油，人家要高潮啦！(〃￣ω￣〃ゞ',
        '哼就这？人家的小缝缝你都看不清吗？再努力点嘛，不然人家要生气了哦～(灬ºωº灬)',
        '呀你这笨蛋！人家的小穴都红成这样了你还认错？再来一次，人家要惩罚你！( >  < )',
        '呜你好笨！人家的小豆豆都硬起来了你都找不到？快点舔对地方啦！(////)',
        '哼哼还行啦！人家的小穴汁都流出来了你才认出来？下次要快一点哦！(ﾉ*ﾟｰﾟ)ﾉ',
        '呀呀一般般啦！人家的小穴都湿湿的了你还猜错～多练习哦！(〃ﾉωﾉ)',
        '呜呜你这小笨蛋！人家的小豆豆都这么明显了～快猜对嘛！()',
        '哼加油啦！人家的小秘密差点被你猜中～下次人家要藏得更深哦！(//ω//)'
    ]
,
    average: [
        '哼就这？人家的小缝缝你都看不清吗？再努力点嘛，不然人家要生气了哦～(〃〃)',
        '呜呜你这笨蛋！人家的粉嫩小豆豆你都找不到吗？快点舔对地方啦！(ﾉ з `)ノ',
        '欸你这色狼！人家的小穴都湿成这样了你还认错？再来一次，不然人家要哭了！(灬º 艸º灬)',
        '呀你好坏！人家的小穴汁都流到大腿了你才发现？下次要早点闻到哦！(ㅅ)',
        '哼还差得远呢！人家的小穴都红肿了你都认不出？多练习啦，小笨蛋！( - )',
        '呜你这小废物！人家的小豆豆都硬硬的了～快猜对不然人家生气！(〃ﾉωﾉ)',
        '呀呀一般哦！人家的小秘密你只猜对一半～下次要全猜中才行！( >  < )',
        '哼哼再努力点啦！人家的小穴汁都滴下来了你还错～人家要惩罚你！(////)'
    ],
    poor: [
        '呜呜你这笨蛋！人家的粉嫩小豆豆你都找不到吗？快点舔对地方啦！(灬ºωº灬)',
        '欸？你眼睛是坏掉了吗？人家全裸在你面前你都看不见？色盲小废物～(〃￣ω￣〃ゞ',
        '哼你这废物！人家的小穴都张开给你看了你还认错？下次记得带放大镜！(//ω//)',
        '呀你这色盲！人家的小穴汁都喷到你脸上了你都不知道？太笨啦！(ﾉ*ﾟｰﾟ)ﾉ',
        '呜哇你连人家的小穴颜色都认不出？人家要哭了！快去检查眼睛啦！()',
        '哼哼你这小笨蛋！人家的小豆豆都这么明显了～快醒醒哦！( ω )',
        '呀呀太差劲了！人家的小秘密你全猜错～人家要生气了！(〃ﾉωﾉ)',
        '呜你这色盲废物！人家的小穴都湿透了你还错～下次别来了！( >  < )'
    ],
    terrible: [
        '欸？你眼睛是坏掉了吗？人家全裸在你面前你都看不见？色盲小废物～下次记得带放大镜来舔哦！(////)',
        '哼你这大废物！人家的小穴都湿成一片了你还认错？连狗都不如！(ﾉ з `)ノ',
        '呀你这色盲！人家的小穴都红到滴血了你都看不见？快滚去医院！(灬º 艸º灬)',
        '呜你这笨蛋！人家的小豆豆都硬到发痛了你都找不到？太没用了！(ㅅ)',
        '嘻你连人家的小穴颜色都认不出？人家要笑死了！下次别来了，小废物！( - )',
        '哼哼你这超级笨蛋！人家的小秘密你全蒙不对～人家笑cry了！(〃ﾉωﾉ)',
        '呀呀太废了！人家的小穴汁都流一地了你还错～快去检查吧！( >  < )',
        '呜呜你这色盲狗！人家全裸摆pose你都认不出～人家要哭了！(//ω//)'
    ]
};

function getRandomComment(level) {
    const list = comments[level];
    return list[Math.floor(Math.random() * list.length)];
}

function startJudgementTimer(reset = true) {
    clearInterval(gameTimer);
    if (reset) timeLeft = 60;
    timerDisplay.textContent = `剩余时间：${timeLeft}秒`;
    resultDisplay.textContent = '';
    resultDisplay.classList.remove('show');
    gameTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `剩余时间：${timeLeft}秒`;
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            gameTimer = null;
            optionsContainer.innerHTML = '';

            let level = '';
            if (judgementScore >= 24) level = 'perfect';
            else if (judgementScore >= 18) level = 'excellent';
            else if (judgementScore >= 14) level = 'good';
            else if (judgementScore >= 10) level = 'average';
            else if (judgementScore >= 5) level = 'poor';
            else level = 'terrible';

            const comment = getRandomComment(level);

            resultDisplay.innerHTML = `
                <div style="font-size:1.9rem; margin-bottom:12px; color:#ff4081;">
                    游戏结束！得分：<span style="color:#ff6b9d; font-weight:bold;">${judgementScore}</span>
                </div>
                <div style="font-size:1.3rem; line-height:1.7;">
                    ${comment.split('～').map(line => line ? `<div class="comment-line">${line}～</div>` : '').join('')}
                </div>
            `;
            setTimeout(() => {
                resultDisplay.classList.add('show');
            }, 100);
        }
    }, 1000);
}

restartJudgement.addEventListener('click', () => {
    judgementScore = 0;
    scoreDisplay.textContent = `得分：${judgementScore}`;
    startJudgementTimer();
    startJudgementRound();
});

startJudgementTimer();
startJudgementRound();

// 主题切换
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// 更新主题颜色（小白条）
function updateThemeColor(isDark) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#0a0408' : '#f5e6ed');
    }
}

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
    updateThemeColor(true);
} else if (currentTheme === 'light') {
    document.body.classList.remove('dark-theme');
    themeToggle.textContent = '🌙';
    updateThemeColor(false);
} else if (prefersDarkScheme.matches) {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
    updateThemeColor(true);
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
        updateThemeColor(true);
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
        updateThemeColor(false);
    }
});
