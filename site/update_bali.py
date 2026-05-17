#!/usr/bin/env python3
"""Update index.html and proposal.html to add Bali as a third destination."""
import os

os.chdir(r'C:\Users\X\claude fold\site')

# ===== 1. Add Bali to DESTINATIONS array in index.html =====
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

bali_entry = '''  {
    id: 'bali', name: '巴厘岛 · 海岛度假', flag: '\U0001f1ee\U0001f1e9',
    region: 'international', desc: '7天6晚 · 海滩度假 · 亲子天堂',
    features: ['旱季凉爽', '水上活动丰富', '亲子项目多'],
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    color: '#1a7a7a',
    latlng: [-8.3, 115.2],
    page: 'itinerary-bali.html'
  },'''

dest_end = content.rindex("];")
insert_pos = content.rindex("\n", 0, dest_end) + 1
content = content[:insert_pos] + bali_entry + "\n" + content[insert_pos:]

# ===== 2. Update comparison table header widths =====
content = content.replace(
    '<th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--border);background:var(--accent-light);color:var(--text-primary);width:20%;">对比项</th>',
    '<th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--border);background:var(--accent-light);color:var(--text-primary);width:15%;">对比项</th>'
)
content = content.replace(
    '<th style="padding:10px 12px;text-align:center;border-bottom:2px solid var(--border);background:#fdf0e0;color:#8b6914;width:40%;">\U0001f1e8\U0001f1f3 新疆·北疆伊犁</th>',
    '<th style="padding:10px 12px;text-align:center;border-bottom:2px solid var(--border);background:#fdf0e0;color:#8b6914;width:29%;">\U0001f1e8\U0001f1f3 新疆·北疆伊犁</th>'
)
content = content.replace(
    '<th style="padding:10px 12px;text-align:center;border-bottom:2px solid var(--border);background:var(--accent-light);color:#b8860b;width:40%;">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</th>',
    '<th style="padding:10px 12px;text-align:center;border-bottom:2px solid var(--border);background:var(--accent-light);color:#b8860b;width:29%;">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</th>\n        <th style="padding:10px 12px;text-align:center;border-bottom:2px solid var(--border);background:#e0f0ef;color:#0d4f4f;width:27%;">\U0001f1ee\U0001f1e9 巴厘岛</th>'
)

# ===== 3. Add comparison data rows =====
# Each replacement: find end of Thailand td before </tr>, add Bali td before </tr>
comparison_rows = [
    # (unique_end_of_thailand_td, closing_tr, bali_td_html)
    ('<span style="font-size:12px;color:var(--text-secondary);font-weight:400;">雨季阵雨，早晚较舒适</span></td>',
     '        <td style="padding:10px 12px;text-align:center;color:#27ae60;font-weight:600;">凉爽 25-30°C<br><span style="font-size:12px;color:var(--text-secondary);font-weight:400;">旱季，巴厘岛最佳季节</span></td>'),

    ('<span style="font-size:12px;color:var(--text-secondary);">清迈进曼谷出，不走回头路</span></td>',
     '        <td style="padding:10px 12px;text-align:center;">直飞巴厘岛约6h<br><span style="font-size:12px;color:var(--text-secondary);">鹰航/东航直达</span></td>'),

    ('<span style="font-size:12px;color:var(--text-secondary);font-weight:400;">约2000泰铢</span></td>',
     '        <td style="padding:10px 12px;text-align:center;color:#e67e22;font-weight:600;">落地签 / 电子签<br><span style="font-size:12px;color:var(--text-secondary);font-weight:400;">约35美元</span></td>'),

    ('color:#27ae60;font-weight:600;">中文服务多，沟通方便</td>',
     '        <td style="padding:10px 12px;text-align:center;color:#e67e22;font-weight:600;">英语为主<br><span style="font-size:12px;color:var(--text-secondary);font-weight:400;">少量中文服务</span></td>'),

    ('<span style="font-size:12px;color:var(--text-secondary);">不辣菜品多，芒果糯米饭等</span></td>',
     '        <td style="padding:10px 12px;text-align:center;">印尼菜清淡+中餐<br><span style="font-size:12px;color:var(--text-secondary);">炒饭、烤猪排、脏鸭餐</span></td>'),

    ('大象营 · 泰式按摩 · 游船</td>',
     '        <td style="padding:10px 12px;text-align:center;">海滩度假 · 水上运动<br>海豚 · SPA · 梯田 · 寺庙</td>'),

    ('清迈住古城/宁曼路<br><span style="font-size:12px;color:var(--text-secondary);">曼谷住暹罗/河畔，仅换一次酒店</span></td>',
     '        <td style="padding:10px 12px;text-align:center;">度假酒店集中<br><span style="font-size:12px;color:var(--text-secondary);">努沙杜瓦/库塔/乌布，各具特色</span></td>'),

    ('<td style="padding:10px 12px;text-align:center;">⭐⭐⭐⭐<br><span style="font-size:12px;color:var(--text-secondary);">节奏可调，服务周到</span></td>',
     '        <td style="padding:10px 12px;text-align:center;">⭐⭐⭐⭐<br><span style="font-size:12px;color:var(--text-secondary);">海岛休闲，SPA放松</span></td>'),

    ('<td style="padding:10px 12px;text-align:center;">⭐⭐⭐⭐⭐<br><span style="font-size:12px;color:var(--text-secondary);">大象营、夜市、夜间动物园</span></td>',
     '        <td style="padding:10px 12px;text-align:center;">⭐⭐⭐⭐⭐<br><span style="font-size:12px;color:var(--text-secondary);">沙滩玩沙、海豚、水上乐园</span></td>'),

    ('<td style="padding:10px 12px;text-align:center;font-weight:600;">5,000 - 9,500 元</td>',
     '        <td style="padding:10px 12px;text-align:center;font-weight:600;">6,000 - 11,000 元</td>'),

    ('<td style="padding:10px 12px;text-align:center;font-weight:600;">8 天</td>',
     '        <td style="padding:10px 12px;text-align:center;font-weight:600;">7 天</td>'),
]

for thai_end, bali_td in comparison_rows:
    # Each row pattern: thai_content + </td>\n      </tr>
    # Replace with: thai_content + </td>\n        bali_td + \n      </tr>
    old = thai_end + '</td>\n      </tr>'
    new = thai_end + '</td>\n' + bali_td + '\n      </tr>'
    if old in content:
        content = content.replace(old, new, 1)
    else:
        print(f"WARNING: Could not match comparison row ending: {repr(thai_end[-20:])}")

# ===== 4. Update view buttons =====
content = content.replace(
    '<a href="itinerary-thailand.html" style="flex:1;min-width:140px;padding:12px;background:var(--accent-light);color:#b8860b;border-radius:10px;text-align:center;text-decoration:none;font-weight:600;font-size:14px;border:2px solid var(--border);transition:all 0.2s;">\n      \U0001f1f9\U0001f1ed 查看泰国行程 →\n    </a>',
    '<a href="itinerary-thailand.html" style="flex:1;min-width:120px;padding:12px;background:var(--accent-light);color:#b8860b;border-radius:10px;text-align:center;text-decoration:none;font-weight:600;font-size:14px;border:2px solid var(--border);transition:all 0.2s;">\n      \U0001f1f9\U0001f1ed 泰国行程 →\n    </a>\n    <a href="itinerary-bali.html" style="flex:1;min-width:120px;padding:12px;background:#e0f0ef;color:#0d4f4f;border-radius:10px;text-align:center;text-decoration:none;font-weight:600;font-size:14px;border:2px solid #b0d5d0;transition:all 0.2s;">\n      \U0001f1ee\U0001f1e9 巴厘岛行程 →\n    </a>'
)

# ===== 5. Update text references =====
content = content.replace('两个目的地', '三个目的地')
content = content.replace('已确定两个目的地', '已确定三个目的地')

content = content.replace(
    '<span style="background:var(--accent-light);color:#b8860b;padding:4px 12px;border-radius:12px;font-size:13px;">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</span>',
    '<span style="background:var(--accent-light);color:#b8860b;padding:4px 12px;border-radius:12px;font-size:13px;">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</span>\n      <span style="background:#e0f0ef;color:#0d4f4f;padding:4px 12px;border-radius:12px;font-size:13px;">\U0001f1ee\U0001f1e9 巴厘岛</span>'
)

# ===== 6. Update procon table in index.html =====
# Add third header
content = content.replace(
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>',
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>\n          <th>\U0001f1ee\U0001f1e9 巴厘岛</th>'
)

# Procon rows
procon_rows = [
    # Climate
    ('<span class="procon-tag tag-good">优势</span> 多为阵雨（半小时即停），室内活动场所充足（商场、水族馆等有空调）。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 7-8月是巴厘岛旱季，25-30°C，凉爽舒适，是一年中最适合旅游的季节！<br><span class="procon-tag tag-good">优势</span> 海风习习，体感比泰国更舒适，老人不易中暑。</td>'),

    # Transport
    ('<span class="procon-tag tag-meh">注意</span> 曼谷部分时段交通拥堵，建议避开早晚高峰。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 上海直飞巴厘岛约6h。当地包车非常方便（约200-300元/天），司机兼导游，景点间车程一般0.5-1.5h。<br><span class="procon-tag tag-meh">注意</span> 飞行6h比泰国稍长，建议选择夜航，孩子可以睡觉。</td>'),

    # Food
    ('<span class="procon-tag tag-meh">注意</span> 部分泰餐偏酸辣（冬阴功、绿咖喱），点菜时需注意选不辣口味。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 印尼菜口味清淡，炒饭、炒面、烤猪排、脏鸭餐等老少皆宜。海鲜新鲜便宜。中餐厅遍布。<br><span class="procon-tag tag-good">优势</span> 热带水果丰富（蛇皮果、山竹、红毛丹等）。</td>'),

    # Elderly
    ('<span class="procon-tag tag-meh">注意</span> 大皇宫等户外景点较晒，建议早上去。曼谷高温天老人需注意补水。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 海岛度假节奏最慢——沙滩躺平、SPA按摩、酒店泳池，最适合老人放松。包车出游不费体力。<br><span class="procon-tag tag-meh">注意</span> 部分海上活动（浮潜等）需根据老人身体状况选择。</td>'),

    # Kids
    ('<span class="procon-tag tag-good">附加</span> 夜市文化丰富，孩子逛吃乐趣多。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 沙滩玩沙挖沙（孩子能玩一整天）、海龟岛亲密接触海龟、巴厘岛野生动物园、水上乐园。<br><span class="procon-tag tag-good">附加</span> 很多酒店有儿童俱乐部，大人可偷闲。</td>'),

    # Multi-family
    ('<span class="procon-tag tag-meh">注意</span> 需要处理签证（落地签或电子签）。部分家庭成员可能需要换护照（有效期需6个月以上）。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 度假酒店多家庭同住非常方便，可选择带厨房的别墅。包车灵活，可定制行程。<br><span class="procon-tag tag-meh">注意</span> 需要落地签（约35美元）。英语沟通需求比泰国高。</td>'),

    # Medical
    ('<span class="procon-tag tag-meh">劣势</span> 需购买旅游保险。国外就医需自费再报销，流程稍复杂。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 巴厘岛有国际医院（BIMC、Siloam），主要集中在努沙杜瓦和库塔。药店遍布。<br><span class="procon-tag tag-meh">劣势</span> 需购买旅游保险。偏远地区（乌布北部）就医不便。</td>'),

    # Budget
    ('<span class="procon-tag tag-meh">注意</span> 机票价格浮动大，建议提前3-4个月购票。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 巴厘岛消费水平低，高端度假酒店性价比极高（五星级约500-1000元/晚）。<br><span class="procon-tag tag-meh">注意</span> 机票和住宿比泰国稍贵。人均6k-11k。旺季需提前预订。</td>'),
]

for thai_end, bali_td in procon_rows:
    old = thai_end + '\n        </tr>'
    new = thai_end + '\n' + bali_td + '\n        </tr>'
    if old in content:
        content = content.replace(old, new, 1)
    else:
        print(f"WARNING: Could not match procon row ending: {repr(thai_end[-30:])}")

# ===== 7. Update summary text =====
content = content.replace(
    '建议：如果各家老人普遍怕热 → 首选新疆；如果各家小孩年龄较小且更看重亲子娱乐 → 泰国更适合。两者预算相当，但体验方向完全不同。',
    '建议：如果各家老人普遍怕热 → 首选新疆；如果各家小孩年龄较小且更看重亲子娱乐 → 泰国；如果大家想悠闲度假、享受海滩和SPA → 巴厘岛。三者预算接近（巴厘岛略高），但体验方向完全不同。'
)

# ===== 8. Update section title =====
content = content.replace('两个方案对比一览', '三个方案对比一览')

content = content.replace('✍️ 两个目的地', '✍️ 三个目的地')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: index.html updated")

# ===== Now update proposal.html =====
with open('proposal.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update references
content = content.replace('2 个目的地方案', '3 个目的地方案')
content = content.replace('2 个方向', '3 个方向')
content = content.replace('国内1个、国外1个', '国内1个、国外2个')

# Add Bali destination card
# Replace the thai_card_end with thai_card_end + bali_card
thai_marker = '——— 国外篇 ———'
thai_card_close = thai_marker + '</div>'

bali_card_html = thai_marker + '</div>\n\n  <!-- === 国外 方案C 巴厘岛 === -->\n  <div class="dest-card">\n    <h4>\U0001f1ee\U0001f1e9 方案C · 巴厘岛</h4>\n    <div class="dest-tags">\n      <span class="dest-tag tag-green">旱季凉爽</span>\n      <span class="dest-tag tag-orange">落地签</span>\n      <span class="dest-tag tag-blue">海岛度假</span>\n      <span class="dest-tag tag-green">亲子天堂</span>\n    </div>\n    <div class="dest-detail">\n      巴厘岛7-8月是旱季（25-30°C），凉爽舒适，是一年中最美的季节！海岛度假节奏慢，努沙杜瓦海滩水清沙细，适合老人孩子。乌布梯田、海神庙、圣猴森林文化体验丰富。海鲜烧烤、SPA按摩、水上活动应有尽有。上海直飞约6h，包车超便宜（约200-300元/天），度假型酒店性价比极高。\n    </div>\n    <div class="dest-pros">✅ 气候凉爽 · 海岛休闲 · 亲子项目多 · 度假酒店性价比高</div>\n    <div class="dest-cons">⚠️ 飞行约6h · 英语为主 · 需落地签（约35美元）</div>\n    <div style="font-size:13px;color:#888;margin-top:4px;">预估人均：6000–11000 元｜飞行约6h｜时差-0h｜推荐7天</div>\n  </div>'

content = content.replace(thai_card_close, bali_card_html)

# Update comparison table in proposal.html
# Add third column header
content = content.replace(
    '<th style="width:30%;">\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>',
    '<th style="width:30%;">\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>\n      <th style="width:30%;">\U0001f1ee\U0001f1e9 巴厘岛</th>'
)

# Proposal comparison rows
proposal_compare = [
    # Climate
    ('<span style="color:#e67e22;">较热 26-33°C（雨季阵雨）</span></td>',
     '<td><span style="color:#27ae60;">凉爽 25-30°C（旱季）</span></td>'),

    # Transport
    ('飞4-5h（直飞清迈或曼谷）</td>',
     '<td>飞约6h（直飞巴厘岛）</td>'),

    # Visa
    ('落地签 / 电子签</td>',
     '<td>落地签（约35美元）</td>'),

    # Language
    ('很小（中文服务多）</td>',
     '<td>较小（英语为主，部分中文）</td>'),

    # Food
    ('高（不辣菜品多，中餐多）</td>',
     '<td>高（印尼菜清淡+中餐多）</td>'),

    # Experiences
    ('寺庙 · 夜市 · 泰式按摩 · 大象营</td>',
     '<td>海滩 · 水上运动 · SPA · 海豚 · 梯田</td>'),

    # Budget
    ('5k-9.5k</td>',
     '<td>6k-11k</td>'),

    # Elderly
    ('⭐⭐⭐⭐（节奏慢可调）</td>',
     '<td>⭐⭐⭐⭐（海岛休闲放松）</td>'),

    # Kids
    ('⭐⭐⭐⭐⭐（夜市动物亲子）</td>',
     '<td>⭐⭐⭐⭐⭐（沙滩水上乐园）</td>'),
]

for thai_end, bali_td in proposal_compare:
    old = thai_end + '\n    </tr>'
    new = thai_end + '\n    ' + bali_td + '\n    </tr>'
    if old in content:
        content = content.replace(old, new, 1)
    else:
        print(f"WARNING: Could not match proposal comparison: {repr(thai_end[-25:])}")

# Update procon header in proposal.html
content = content.replace(
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>\n          <th>\U0001f1ee\U0001f1e9 巴厘岛</th>',
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>'
)
content = content.replace(
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>',
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>\n          <th>\U0001f1ee\U0001f1e9 巴厘岛</th>'
)

# Proposal procon rows
proposal_procon = [
    # Climate
    ('<span class="procon-tag tag-good">优势</span> 多为阵雨（半小时即停），室内活动场所充足（商场、水族馆等有空调）。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 7-8月旱季25-30°C，凉爽舒适，是一年最佳季节。海风习习，体感比泰国舒适。<br><span class="procon-tag tag-good">附加</span> 紫外线同样强，做好防晒。</td>'),

    # Transport
    ('<span class="procon-tag tag-meh">注意</span> 曼谷部分时段交通拥堵，建议避开早晚高峰。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 上海直飞约6h。当地包车约200-300元/天，景点间0.5-1.5h车程，非常轻松。<br><span class="procon-tag tag-meh">注意</span> 飞行6h比泰国稍长，建议选夜航。</td>'),

    # Food
    ('<span class="procon-tag tag-meh">注意</span> 部分泰餐偏酸辣（冬阴功、绿咖喱），点菜时需注意选不辣口味。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 印尼菜清淡不辣，炒饭炒面烤猪排脏鸭餐老少皆宜。海鲜丰富新鲜。中餐厅遍布。<br><span class="procon-tag tag-good">优势</span> 热带水果便宜好吃。</td>'),

    # Elderly
    ('<span class="procon-tag tag-meh">注意</span> 大皇宫等户外景点较晒，建议早上去。曼谷高温天老人需注意补水。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 海岛度假节奏最慢，沙滩SPA泳池最适合老人。包车出游不费体力。<br><span class="procon-tag tag-meh">注意</span> 海上活动需评估老人身体状况。</td>'),

    # Kids
    ('<span class="procon-tag tag-good">附加</span> 夜市文化丰富，孩子逛吃乐趣多。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 沙滩玩沙、海龟岛、野生动物园、水上乐园。酒店儿童俱乐部可托管孩子。<br><span class="procon-tag tag-good">附加</span> 很多亲子度假酒店一价全包。</td>'),

    # Multi-family
    ('<span class="procon-tag tag-meh">注意</span> 需要处理签证（落地签或电子签）。部分家庭成员可能需要换护照（有效期需6个月以上）。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 度假别墅适合多家庭同住。包车灵活定制行程。<br><span class="procon-tag tag-meh">注意</span> 需落地签35美元。英语沟通需求较高。</td>'),

    # Medical
    ('<span class="procon-tag tag-meh">劣势</span> 需购买旅游保险。国外就医需自费再报销，流程稍复杂。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 努沙杜瓦和库塔有国际医院（BIMC、Siloam）。<br><span class="procon-tag tag-meh">劣势</span> 需旅游保险。乌布等偏远地区就医不便。</td>'),

    # Cost
    ('<span class="procon-tag tag-meh">注意</span> 机票价格浮动大，建议提前3-4个月购票。</td>',
     '          <td><span class="procon-tag tag-good">优势</span> 消费水平低，五星度假酒店性价比极高。人均6k-11k。<br><span class="procon-tag tag-meh">注意</span> 机票和住宿比泰国稍贵。7-8月旺季需提前预订。</td>'),
]

for thai_end, bali_td in proposal_procon:
    old = thai_end + '\n        </tr>'
    new = thai_end + '\n' + bali_td + '\n        </tr>'
    if old in content:
        content = content.replace(old, new, 1)
    else:
        print(f"WARNING: Could not match proposal procon: {repr(thai_end[-30:])}")

# Update summary text in proposal.html
content = content.replace(
    '建议：如果各家老人普遍怕热 → 首选新疆；如果各家小孩年龄较小且更看重亲子娱乐 → 泰国；如果大家想悠闲度假、享受海滩和SPA → 巴厘岛。三者预算接近（巴厘岛略高），但体验方向完全不同。',
    '建议：如果各家老人普遍怕热 → 首选新疆；如果各家小孩年龄较小且更看重亲子娱乐 → 泰国；如果大家想悠闲度假、享受海滩和SPA → 巴厘岛。三者预算接近（巴厘岛略高），但体验方向完全不同。'
)

# Add Bali checkbox to feedback form
content = content.replace(
    '<label class="checkbox-label dest-opt" data-value="泰国">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</label>',
    '<label class="checkbox-label dest-opt" data-value="泰国">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</label>\n        <label class="checkbox-label dest-opt" data-value="巴厘岛">\U0001f1ee\U0001f1e9 巴厘岛</label>'
)

with open('proposal.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: proposal.html updated")
print("Done! Both files updated.")
