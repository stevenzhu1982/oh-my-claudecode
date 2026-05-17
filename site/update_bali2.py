#!/usr/bin/env python3
"""Update index.html and proposal.html to add Bali as a third destination."""
import os
os.chdir(r'C:\Users\X\claude fold\site')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# === 1. Add Bali to DESTINATIONS array ===
bali_entry = """  {
    id: 'bali', name: '巴厘岛 · 海岛度假', flag: '\U0001f1ee\U0001f1e9',
    region: 'international', desc: '7天6晚 · 海滩度假 · 亲子天堂',
    features: ['旱季凉爽', '水上活动丰富', '亲子项目多'],
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    color: '#1a7a7a',
    latlng: [-8.3, 115.2],
    page: 'itinerary-bali.html'
  },"""

idx = content.find("];")
nl = content.rfind("\n", 0, idx)
content = content[:nl] + "\n" + bali_entry + content[nl:]

# === 2. Update text references ===
content = content.replace("两个目的地", "三个目的地")
content = content.replace("已确定两个目的地", "已确定三个目的地")
content = content.replace("两个方案对比一览", "三个方案对比一览")

# === 3. Add Bali to announcement tags ===
old_tags = '<span style="background:var(--accent-light);color:#b8860b;padding:4px 12px;border-radius:12px;font-size:13px;">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</span>'
new_tags = old_tags + '\n      <span style="background:#e0f0ef;color:#0d4f4f;padding:4px 12px;border-radius:12px;font-size:13px;">\U0001f1ee\U0001f1e9 巴厘岛</span>'
content = content.replace(old_tags, new_tags)

# === 4. Update comparison table header ===
content = content.replace('width:20%;">对比项</th>', 'width:15%;">对比项</th>')
content = content.replace('width:40%;">\U0001f1e8\U0001f1f3 新疆·北疆伊犁</th>', 'width:29%;">\U0001f1e8\U0001f1f3 新疆·北疆伊犁</th>')

old_thai_th = 'width:40%;background:var(--accent-light);color:#b8860b;">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</th>'
bali_th = '        <th style="padding:10px 12px;text-align:center;border-bottom:2px solid var(--border);background:#e0f0ef;color:#0d4f4f;width:27%;">\U0001f1ee\U0001f1e9 巴厘岛</th>'
content = content.replace(old_thai_th, old_thai_th.replace('width:40%', 'width:29%') + '\n' + bali_th)

# === 5. Add view button for Bali ===
old_btn = '<a href="itinerary-thailand.html" style="flex:1;min-width:140px;padding:12px;background:var(--accent-light);color:#b8860b;border-radius:10px;text-align:center;text-decoration:none;font-weight:600;font-size:14px;border:2px solid var(--border);transition:all 0.2s;">\n      \U0001f1f9\U0001f1ed 查看泰国行程 →\n    </a>'
bali_btn = '<a href="itinerary-bali.html" style="flex:1;min-width:120px;padding:12px;background:#e0f0ef;color:#0d4f4f;border-radius:10px;text-align:center;text-decoration:none;font-weight:600;font-size:14px;border:2px solid #b0d5d0;transition:all 0.2s;">\n      \U0001f1ee\U0001f1e9 巴厘岛行程 →\n    </a>'
content = content.replace(old_btn, old_btn.replace('min-width:140px', 'min-width:120px').replace('查看泰国行程', '泰国行程') + '\n' + bali_btn)

# === 6. Update comparison table rows ===
table_start = content.find('width:15%;">对比项</th>')
tbody_start = content.find('<tbody>', table_start)
tbody_end = content.find('</tbody>', tbody_start)

bali_comparison_data = [
    '<td style="padding:10px 12px;text-align:center;color:#27ae60;font-weight:600;">凉爽 25-30°C<br><span style="font-size:12px;color:var(--text-secondary);font-weight:400;">旱季，巴厘岛最佳季节</span></td>',
    '<td style="padding:10px 12px;text-align:center;">直飞巴厘岛约6h<br><span style="font-size:12px;color:var(--text-secondary);">鹰航/东航直达</span></td>',
    '<td style="padding:10px 12px;text-align:center;color:#e67e22;font-weight:600;">落地签 / 电子签<br><span style="font-size:12px;color:var(--text-secondary);font-weight:400;">约35美元</span></td>',
    '<td style="padding:10px 12px;text-align:center;color:#e67e22;font-weight:600;">英语为主<br><span style="font-size:12px;color:var(--text-secondary);font-weight:400;">少量中文服务</span></td>',
    '<td style="padding:10px 12px;text-align:center;">印尼菜清淡+中餐<br><span style="font-size:12px;color:var(--text-secondary);">炒饭、烤猪排、脏鸭餐</span></td>',
    '<td style="padding:10px 12px;text-align:center;">海滩度假 · 水上运动<br>海豚 · SPA · 梯田 · 寺庙</td>',
    '<td style="padding:10px 12px;text-align:center;">度假酒店集中<br><span style="font-size:12px;color:var(--text-secondary);">努沙杜瓦/库塔/乌布，各具特色</span></td>',
    '<td style="padding:10px 12px;text-align:center;">⭐⭐⭐⭐<br><span style="font-size:12px;color:var(--text-secondary);">海岛休闲，SPA放松</span></td>',
    '<td style="padding:10px 12px;text-align:center;">⭐⭐⭐⭐⭐<br><span style="font-size:12px;color:var(--text-secondary);">沙滩玩沙、海豚、水上乐园</span></td>',
    '<td style="padding:10px 12px;text-align:center;font-weight:600;">6,000 - 11,000 元</td>',
    '<td style="padding:10px 12px;text-align:center;font-weight:600;">7 天</td>',
]

# Split tbody into lines and process row by row
lines = content[tbody_start:tbody_end].split('\n')
new_lines = []
row_idx = 0
for line in lines:
    new_lines.append(line)
    if '</tr>' in line and row_idx < len(bali_comparison_data):
        # Add Bali td before the </tr>
        indent = '        '
        bali_line = indent + bali_comparison_data[row_idx]
        new_lines.append(bali_line)
        row_idx += 1

new_tbody = '\n'.join(new_lines)
content = content[:tbody_start] + new_tbody + content[tbody_end:]

# === 7. Procon table - add header ===
content = content.replace(
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>',
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>\n          <th>\U0001f1ee\U0001f1e9 巴厘岛</th>'
)

# === 8. Procon rows ===
bali_procon_data = [
    '<td><span class="procon-tag tag-good">优势</span> 7-8月是巴厘岛旱季，25-30°C，凉爽舒适，是一年中最适合旅游的季节！<br><span class="procon-tag tag-good">优势</span> 海风习习，体感比泰国更舒适，老人不易中暑。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 上海直飞巴厘岛约6h。当地包车非常方便（约200-300元/天），司机兼导游，景点间车程0.5-1.5h。<br><span class="procon-tag tag-meh">注意</span> 飞行6h比泰国稍长，建议选择夜航。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 印尼菜口味清淡，炒饭、炒面、烤猪排、脏鸭餐等老少皆宜。海鲜新鲜便宜。中餐厅遍布。<br><span class="procon-tag tag-good">优势</span> 热带水果丰富。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 海岛度假节奏最慢——沙滩躺平、SPA按摩、酒店泳池，最适合老人放松。包车出游不费体力。<br><span class="procon-tag tag-meh">注意</span> 部分海上活动需根据老人身体状况选择。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 沙滩玩沙挖沙、海龟岛、野生动物园、水上乐园。<br><span class="procon-tag tag-good">附加</span> 很多酒店有儿童俱乐部，大人可偷闲。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 度假酒店多家庭同住非常方便，可选择带厨房的别墅。包车灵活。<br><span class="procon-tag tag-meh">注意</span> 需落地签约35美元。英语沟通需求比泰国高。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 巴厘岛有国际医院（BIMC、Siloam），努沙杜瓦和库塔医疗方便。<br><span class="procon-tag tag-meh">劣势</span> 需购买旅游保险。偏远地区就医不便。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 消费水平低，高端度假酒店性价比极高。<br><span class="procon-tag tag-meh">注意</span> 机票和住宿比泰国稍贵。人均6k-11k。旺季需提前预订。</td>',
]

# Find procon table in the content
procon_idx = content.find('class="procon-table-wrap"')
if procon_idx >= 0:
    procon_tbl_start = content.find('<table', procon_idx)
    procon_tbl_end = content.find('</table>', procon_tbl_start)

    tbl_content = content[procon_tbl_start:procon_tbl_end + len('</table>')]
    lines = tbl_content.split('\n')
    new_lines = []
    row_idx = 0
    header_skipped = False
    for line in lines:
        new_lines.append(line)
        if not header_skipped and '</tr>' in line:
            header_skipped = True
            continue
        if header_skipped and '</tr>' in line and row_idx < len(bali_procon_data):
            indent = '          '
            bali_line = indent + bali_procon_data[row_idx]
            new_lines.append(bali_line)
            row_idx += 1

    new_tbl = '\n'.join(new_lines)
    content = content[:procon_tbl_start] + new_tbl + content[procon_tbl_end + len('</table>'):]

# === 9. Update summary text ===
content = content.replace(
    '如果各家老人普遍怕热 → 首选新疆；如果各家小孩年龄较小且更看重亲子娱乐 → 泰国更适合。两者预算相当，但体验方向完全不同。',
    '如果各家老人普遍怕热 → 首选新疆；如果各家小孩年龄较小且更看重亲子娱乐 → 泰国；如果大家想悠闲度假、享受海滩和SPA → 巴厘岛。三者预算接近（巴厘岛略高），但体验方向完全不同。'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: index.html updated")

# ===== Now handle proposal.html =====
with open('proposal.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update text references
content = content.replace('2 个目的地方案', '3 个目的地方案')
content = content.replace('2 个方向', '3 个方向')
content = content.replace('国内1个、国外1个', '国内1个、国外2个')

# Add Bali destination card after Thailand
thai_end_marker = '预估人均：5000–9500 元｜飞行4-5h｜时差-1h｜推荐8天</div>\n  </div>\n\n  <div style="margin:20px 0;text-align:center;font-size:16px;color:#999;">━━━ 国外篇 ━━━</div>'

bali_card_html = """预估人均：5000–9500 元｜飞行4-5h｜时差-1h｜推荐8天</div>
  </div>

  <!-- === 国外 方案C 巴厘岛 === -->
  <div class="dest-card">
    <h4>\U0001f1ee\U0001f1e9 方案C · 巴厘岛</h4>
    <div class="dest-tags">
      <span class="dest-tag tag-green">旱季凉爽</span>
      <span class="dest-tag tag-orange">落地签</span>
      <span class="dest-tag tag-blue">海岛度假</span>
      <span class="dest-tag tag-green">亲子天堂</span>
    </div>
    <div class="dest-detail">
      巴厘岛7-8月是旱季（25-30°C），凉爽舒适，是一年中最美的季节！海岛度假节奏慢，努沙杜瓦海滩水清沙细，适合老人孩子。乌布梯田、海神庙、圣猴森林文化体验丰富。海鲜烧烤、SPA按摩、水上活动应有尽有。上海直飞约6h，包车超便宜（约200-300元/天），度假型酒店性价比极高。
    </div>
    <div class="dest-pros">✅ 气候凉爽 · 海岛休闲 · 亲子项目多 · 度假酒店性价比高</div>
    <div class="dest-cons">⚠️ 飞行约6h · 英语为主 · 需落地签（约35美元）</div>
    <div style="font-size:13px;color:#888;margin-top:4px;">预估人均：6000–11000 元｜飞行约6h｜时差-0h｜推荐7天</div>
  </div>

  <div style="margin:20px 0;text-align:center;font-size:16px;color:#999;">━━━ 国外篇 ━━━</div>"""

content = content.replace(thai_end_marker, bali_card_html)

# Add Bali to comparison table header
content = content.replace(
    '<th style="width:30%;">\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>',
    '<th style="width:30%;">\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>\n      <th style="width:30%;">\U0001f1ee\U0001f1e9 巴厘岛</th>'
)

# Add comparison rows
bali_prop_compare = [
    '<td><span style="color:#27ae60;">凉爽 25-30°C（旱季）</span></td>',
    '<td>飞约6h（直飞巴厘岛）</td>',
    '<td>落地签（约35美元）</td>',
    '<td>较小（英语为主，部分中文）</td>',
    '<td>高（印尼菜清淡+中餐多）</td>',
    '<td>海滩 · 水上运动 · SPA · 海豚 · 梯田</td>',
    '<td>6k-11k</td>',
    '<td>⭐⭐⭐⭐（海岛休闲放松）</td>',
    '<td>⭐⭐⭐⭐⭐（沙滩水上乐园）</td>',
]

# Find the comparison table in proposal.html
scroll_start = content.find('class="scroll-wrap"')
if scroll_start >= 0:
    tbl_lines = content[:content.find('</div>', scroll_start + 100)].split('\n')
    # Hmm this is getting complex, let me just find </tr> after the table and add
    pos = scroll_start
    for i in range(3):  # skip header and 2 header rows
        pos = content.find('</tr>', pos) + 5

    for i, bali_td in enumerate(bali_prop_compare):
        tr_end = content.find('</tr>', pos + 1)
        if tr_end < 0:
            break
        content = content[:tr_end] + '\n    ' + bali_td + '\n    ' + content[tr_end:]
        pos = tr_end + len(bali_td) + 10

# Add Bali procon header
content = content.replace(
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>\n          <th>\U0001f1ee\U0001f1e9 巴厘岛</th>',
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>'
)
content = content.replace(
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>',
    '<th>\U0001f1f9\U0001f1ed 泰国（清迈+曼谷）</th>\n          <th>\U0001f1ee\U0001f1e9 巴厘岛</th>'
)

# Add procon rows
bali_prop_procon = [
    '<td><span class="procon-tag tag-good">优势</span> 7-8月旱季25-30°C，凉爽，一年最佳季节。海风习习。<br><span class="procon-tag tag-good">附加</span> 紫外线同样强，注意防晒。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 上海直飞约6h。包车约200-300元/天，景点间0.5-1.5h车程。<br><span class="procon-tag tag-meh">注意</span> 飞行6h比泰国稍长，建议选夜航。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 印尼菜清淡不辣，炒饭炒面烤猪排脏鸭餐老少皆宜。海鲜丰富。<br><span class="procon-tag tag-good">优势</span> 热带水果便宜好吃。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 海岛度假节奏最慢，沙滩SPA泳池最适合老人。<br><span class="procon-tag tag-meh">注意</span> 海上活动需评估身体状况。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 沙滩玩沙、海龟岛、野生动物园、水上乐园。儿童俱乐部。<br><span class="procon-tag tag-good">附加</span> 很多亲子度假酒店一价全包。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 度假别墅适合多家庭同住。包车灵活。<br><span class="procon-tag tag-meh">注意</span> 需落地签35美元。英语沟通需求较高。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 努沙杜瓦和库塔有国际医院。<br><span class="procon-tag tag-meh">劣势</span> 需旅游保险。偏远地区就医不便。</td>',
    '<td><span class="procon-tag tag-good">优势</span> 消费水平低，五星度假酒店性价比极高。<br><span class="procon-tag tag-meh">注意</span> 机票住宿比泰国稍贵。人均6k-11k。</td>',
]

# Find procon table
procon_section = content.find('三、针对本次出行的详细优缺点分析')
if procon_section >= 0:
    tbl_start = content.find('<table class="procon-table">', procon_section)
    if tbl_start >= 0:
        tbl_end = content.find('</table>', tbl_start)
        tbl_content = content[tbl_start:tbl_end]
        lines = tbl_content.split('\n')
        new_lines = []
        row_idx = 0
        header_done = False
        for line in lines:
            new_lines.append(line)
            if not header_done and '</tr>' in line:
                header_done = True
                continue
            if header_done and '</tr>' in line and row_idx < len(bali_prop_procon):
                indent = '          '
                new_lines.append(indent + bali_prop_procon[row_idx])
                row_idx += 1
        new_tbl = '\n'.join(new_lines)
        content = content[:tbl_start] + new_tbl + content[tbl_end:]

# Update summary in procon
content = content.replace(
    '<strong>建议：</strong>如果各家老人普遍怕热 → 首选新疆；如果各家小孩年龄较小（学龄前或小学低年级）且更看重亲子娱乐 → 泰国更适合。两者预算相当，但体验方向完全不同。',
    '<strong>建议：</strong>如果各家老人普遍怕热 → 首选新疆；如果各家小孩年龄较小（学龄前或小学低年级）且更看重亲子娱乐 → 泰国；如果大家想悠闲度假、享受海滩和SPA → 巴厘岛。三者预算接近（巴厘岛略高），但体验方向完全不同。'
)

# Add Bali checkbox to feedback form
content = content.replace(
    '<label class="checkbox-label dest-opt" data-value="泰国">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</label>',
    '<label class="checkbox-label dest-opt" data-value="泰国">\U0001f1f9\U0001f1ed 泰国·清迈+曼谷</label>\n        <label class="checkbox-label dest-opt" data-value="巴厘岛">\U0001f1ee\U0001f1e9 巴厘岛</label>'
)

with open('proposal.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: proposal.html updated")
print("Both files updated!")
