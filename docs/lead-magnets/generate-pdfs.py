"""Generate BaseScape lead magnet PDFs with branded styling and images."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    HRFlowable, KeepTogether, Image, CondPageBreak,
)
from reportlab.platypus.flowables import Flowable
import os

# ── Brand colors ──────────────────────────────────────────────
NAVY = HexColor('#1a2744')
GREEN = HexColor('#2d6a4f')
AMBER = HexColor('#d4a574')
SLATE = HexColor('#4a5568')
LIGHT_BG = HexColor('#f7f8fa')
LIGHT_GREEN = HexColor('#e8f0ec')
LIGHT_AMBER = HexColor('#faf3eb')
WHITE = white
BLACK = black

# ── Image directory ───────────────────────────────────────────
IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images')

# ── Styles ────────────────────────────────────────────────────
def make_styles():
    return {
        'cover_title': ParagraphStyle(
            'CoverTitle', fontName='Helvetica-Bold', fontSize=32,
            leading=38, textColor=WHITE, alignment=TA_LEFT,
            spaceAfter=12,
        ),
        'cover_subtitle': ParagraphStyle(
            'CoverSubtitle', fontName='Helvetica', fontSize=16,
            leading=22, textColor=AMBER, alignment=TA_LEFT,
            spaceAfter=24,
        ),
        'cover_footer': ParagraphStyle(
            'CoverFooter', fontName='Helvetica-Oblique', fontSize=11,
            leading=14, textColor=HexColor('#c8cdd6'), alignment=TA_LEFT,
        ),
        'h1': ParagraphStyle(
            'H1', fontName='Helvetica-Bold', fontSize=22,
            leading=28, textColor=NAVY, spaceAfter=14, spaceBefore=0,
        ),
        'h2': ParagraphStyle(
            'H2', fontName='Helvetica-Bold', fontSize=16,
            leading=22, textColor=GREEN, spaceAfter=8, spaceBefore=18,
        ),
        'h3': ParagraphStyle(
            'H3', fontName='Helvetica-Bold', fontSize=13,
            leading=18, textColor=NAVY, spaceAfter=6, spaceBefore=12,
        ),
        'body': ParagraphStyle(
            'Body', fontName='Helvetica', fontSize=10.5,
            leading=16, textColor=SLATE, spaceAfter=8,
        ),
        'body_bold': ParagraphStyle(
            'BodyBold', fontName='Helvetica-Bold', fontSize=10.5,
            leading=16, textColor=SLATE, spaceAfter=8,
        ),
        'bullet': ParagraphStyle(
            'Bullet', fontName='Helvetica', fontSize=10.5,
            leading=16, textColor=SLATE, spaceAfter=4,
            leftIndent=20, bulletIndent=8, bulletFontName='Helvetica',
        ),
        'checklist': ParagraphStyle(
            'Checklist', fontName='Helvetica', fontSize=10.5,
            leading=16, textColor=SLATE, spaceAfter=4,
            leftIndent=24, bulletIndent=8,
        ),
        'callout': ParagraphStyle(
            'Callout', fontName='Helvetica-Oblique', fontSize=10.5,
            leading=16, textColor=GREEN, spaceAfter=10,
            leftIndent=12,
        ),
        'redflag': ParagraphStyle(
            'RedFlag', fontName='Helvetica-Bold', fontSize=10.5,
            leading=16, textColor=HexColor('#c0392b'), spaceAfter=10,
            leftIndent=12,
        ),
        'cta_heading': ParagraphStyle(
            'CTAHeading', fontName='Helvetica-Bold', fontSize=18,
            leading=24, textColor=NAVY, alignment=TA_CENTER, spaceAfter=12,
        ),
        'cta_body': ParagraphStyle(
            'CTABody', fontName='Helvetica', fontSize=12,
            leading=18, textColor=SLATE, alignment=TA_CENTER, spaceAfter=6,
        ),
        'cta_phone': ParagraphStyle(
            'CTAPhone', fontName='Helvetica-Bold', fontSize=20,
            leading=26, textColor=GREEN, alignment=TA_CENTER, spaceAfter=6,
        ),
        'cta_small': ParagraphStyle(
            'CTASmall', fontName='Helvetica', fontSize=10,
            leading=14, textColor=SLATE, alignment=TA_CENTER, spaceAfter=4,
        ),
        'cta_tagline': ParagraphStyle(
            'CTATagline', fontName='Helvetica-Oblique', fontSize=11,
            leading=16, textColor=SLATE, alignment=TA_CENTER, spaceAfter=0,
        ),
        'caption': ParagraphStyle(
            'Caption', fontName='Helvetica-Oblique', fontSize=9,
            leading=12, textColor=SLATE, alignment=TA_CENTER,
            spaceBefore=4, spaceAfter=12,
        ),
        'table_header': ParagraphStyle(
            'TableHeader', fontName='Helvetica-Bold', fontSize=10,
            leading=14, textColor=WHITE,
        ),
        'table_cell': ParagraphStyle(
            'TableCell', fontName='Helvetica', fontSize=9.5,
            leading=13, textColor=SLATE,
        ),
        'table_cell_bold': ParagraphStyle(
            'TableCellBold', fontName='Helvetica-Bold', fontSize=9.5,
            leading=13, textColor=NAVY,
        ),
    }


# ── Custom flowables ─────────────────────────────────────────

class ColorBlock(Flowable):
    """Full-width colored block with padding."""
    def __init__(self, content, bg_color, padding=12, width=None):
        super().__init__()
        self.content = content
        self.bg_color = bg_color
        self.padding = padding
        self._width = width or 6.5 * inch

    def wrap(self, availWidth, availHeight):
        self.content.wrapOn(self.canv, self._width - 2 * self.padding, availHeight)
        self.height = self.content.height + 2 * self.padding
        self.width = self._width
        return self.width, self.height

    def draw(self):
        self.canv.setFillColor(self.bg_color)
        self.canv.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=0)
        self.content.drawOn(self.canv, self.padding, self.padding)


class NumberedItem(Flowable):
    """Numbered circle + title + body text."""
    def __init__(self, number, title, body, styles):
        super().__init__()
        self.number = number
        self.title_text = title
        self.body_text = body
        self.styles = styles

    def wrap(self, availWidth, availHeight):
        self.avail_w = availWidth
        body_w = availWidth - 40
        self._title = Paragraph(f'<b>{self.title_text}</b>', self.styles['h3'])
        self._body = Paragraph(self.body_text, self.styles['body'])
        self._title.wrapOn(self.canv, body_w, availHeight)
        self._body.wrapOn(self.canv, body_w, availHeight)
        self.height = self._title.height + self._body.height + 8
        self.width = availWidth
        return self.width, self.height

    def draw(self):
        # Number circle
        cx, cy = 14, self.height - 14
        self.canv.setFillColor(GREEN)
        self.canv.circle(cx, cy, 12, fill=1, stroke=0)
        self.canv.setFillColor(WHITE)
        self.canv.setFont('Helvetica-Bold', 11)
        self.canv.drawCentredString(cx, cy - 4, str(self.number))
        # Title + body
        y = self.height - self._title.height
        self._title.drawOn(self.canv, 40, y)
        y -= self._body.height + 4
        self._body.drawOn(self.canv, 40, y)


class RoundedImage(Flowable):
    """Image with rounded corners and optional border."""
    def __init__(self, img_path, width, height=None, radius=8):
        super().__init__()
        self.img_path = img_path
        self.img_width = width
        self.img_height = height
        self.radius = radius

    def wrap(self, availWidth, availHeight):
        from reportlab.lib.utils import ImageReader
        if self.img_height is None:
            img = ImageReader(self.img_path)
            iw, ih = img.getSize()
            self.img_height = self.img_width * ih / iw
        self.width = self.img_width
        self.height = self.img_height
        return self.width, self.height

    def draw(self):
        self.canv.saveState()
        p = self.canv.beginPath()
        p.roundRect(0, 0, self.width, self.height, self.radius)
        self.canv.clipPath(p, stroke=0)
        self.canv.drawImage(
            self.img_path, 0, 0,
            width=self.width, height=self.height,
            preserveAspectRatio=True, anchor='c',
        )
        self.canv.restoreState()
        # Subtle border
        self.canv.setStrokeColor(HexColor('#dde1e6'))
        self.canv.setLineWidth(0.5)
        self.canv.roundRect(0, 0, self.width, self.height, self.radius)


# ── Page templates ────────────────────────────────────────────

def _footer(canvas_obj, doc):
    """Standard page footer with divider line."""
    canvas_obj.saveState()
    w = letter[0]
    canvas_obj.setStrokeColor(HexColor('#dde1e6'))
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(inch, 0.6 * inch, w - inch, 0.6 * inch)
    canvas_obj.setFont('Helvetica', 8)
    canvas_obj.setFillColor(SLATE)
    canvas_obj.drawString(inch, 0.4 * inch, 'BaseScape  |  Licensed  |  Bonded  |  Insured')
    canvas_obj.drawRightString(w - inch, 0.4 * inch, f'Page {doc.page}')
    canvas_obj.restoreState()


def make_cover_bg(cover_image_path):
    """Factory: returns onFirstPage handler with photo background + navy overlay."""
    def _cover_bg(canvas_obj, doc):
        w, h = letter
        canvas_obj.saveState()
        # Draw cover photo filling the page
        canvas_obj.drawImage(
            cover_image_path, 0, 0, width=w, height=h,
            preserveAspectRatio=True, anchor='c',
        )
        # Semi-transparent navy overlay for text readability
        canvas_obj.setFillColor(NAVY)
        canvas_obj.setFillAlpha(0.78)
        canvas_obj.rect(0, 0, w, h, fill=1, stroke=0)
        # Green accent stripe at bottom
        canvas_obj.setFillAlpha(1.0)
        canvas_obj.setFillColor(GREEN)
        canvas_obj.rect(0, 0, w, 8, fill=1, stroke=0)
        canvas_obj.restoreState()
    return _cover_bg


# ── Helpers ───────────────────────────────────────────────────

def hr():
    return HRFlowable(width='100%', thickness=0.5, color=HexColor('#dde1e6'),
                      spaceAfter=12, spaceBefore=6)


def inline_image(filename, width=6.5 * inch, height=None, caption_text=None, styles=None):
    """Return list of flowables: rounded image + optional caption."""
    path = os.path.join(IMG_DIR, filename)
    items = [RoundedImage(path, width=width, height=height)]
    if caption_text and styles:
        items.append(Paragraph(caption_text, styles['caption']))
    else:
        items.append(Spacer(1, 12))
    return items


# ── Builders ──────────────────────────────────────────────────

def build_walkout_pdf(output_path):
    s = make_styles()
    doc = SimpleDocTemplate(
        output_path, pagesize=letter,
        leftMargin=inch, rightMargin=inch,
        topMargin=inch, bottomMargin=0.9 * inch,
        title="The Utah Homeowner's Guide to Walkout Basements",
        author='BaseScape',
    )
    story = []

    # ── COVER ──
    story.append(Spacer(1, 2.2 * inch))
    story.append(Paragraph("The Utah Homeowner's Guide to", s['cover_subtitle']))
    story.append(Paragraph('Walkout Basements', s['cover_title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph('Costs, ROI &amp; What to Expect', s['cover_subtitle']))
    story.append(Spacer(1, 1.8 * inch))
    story.append(Paragraph('A free resource from BaseScape', s['cover_footer']))
    story.append(Paragraph('Licensed  |  Bonded  |  Insured', s['cover_footer']))
    story.append(PageBreak())

    # ── PAGE 2: COSTS ──
    story.append(Paragraph('What Does a Walkout Basement Cost?', s['h1']))
    story.append(hr())
    story.append(Paragraph(
        'Walkout basement conversions on Utah\'s Wasatch Front typically range from '
        '<b>$50,000 to $100,000+</b>. This is a major structural project \u2014 '
        'here\'s what drives the investment:', s['body']))
    story.append(Spacer(1, 6))

    cost_factors = [
        ('Foundation type', 'is the primary factor. Poured concrete foundations are more '
         'straightforward to cut than block foundations, which require more structural '
         'reinforcement after opening.'),
        ('Slope grade', 'determines how much excavation is needed. A lot with existing grade '
         'change requires less earthwork than a flat lot.'),
        ('Drainage requirements', 'vary by site. Proper waterproofing, French drains, and '
         'grading are non-negotiable for a below-grade opening.'),
        ('Finish level', 'inside the walkout space affects total cost. A basic shell is '
         'significantly less than a fully finished living space with bathroom, kitchenette, '
         'and flooring.'),
    ]
    for label, desc in cost_factors:
        story.append(Paragraph(f'\u2022  <b>{label}</b> {desc}', s['bullet']))
    story.append(Spacer(1, 10))

    story.append(Paragraph('Why This Investment Pays Off', s['h2']))
    story.append(Paragraph(
        'A walkout basement isn\'t just a renovation \u2014 it\'s one of the highest-ROI '
        'improvements you can make to a Utah home. You\'re adding livable square footage, '
        'natural light, and direct outdoor access to space that\'s already under your roof.',
        s['body']))
    story.append(Spacer(1, 8))

    # Interior image on costs page to fill space
    story.extend(inline_image(
        'walkout-interior.png', width=6.5 * inch, height=2.8 * inch,
        caption_text='A finished walkout basement flooded with natural light \u2014 '
                     'this is what transforms below-grade space into premium living area.',
        styles=s,
    ))
    story.append(PageBreak())

    # ── ROI ──
    story.append(Paragraph('The ROI Case for Walkout Basements', s['h1']))
    story.append(hr())

    story.append(Paragraph('Property Value Increase', s['h2']))
    story.append(Paragraph(
        'A walkout basement conversion can add <b>$70,000 or more</b> to your home\'s value. '
        'Above-grade square footage (which a walkout creates) is valued significantly higher '
        'than below-grade space by appraisers and buyers.', s['body']))

    story.append(Paragraph('ADU Rental Income', s['h2']))
    story.append(Paragraph(
        'Utah\'s ADU-friendly laws make walkout basements ideal rental units:', s['body']))
    adu_items = [
        '<b>HB 398</b> allows internal ADUs (like basement apartments) in all residential zones statewide',
        '<b>SB 174</b> requires cities to allow at least one ADU type per lot',
        '<b>"The Stove Rule"</b> \u2014 a space with a separate entrance, kitchen, and bathroom qualifies as an ADU',
    ]
    for item in adu_items:
        story.append(Paragraph(f'\u2022  {item}', s['bullet']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        'A walkout basement with a separate entrance is the most natural ADU configuration. '
        'Rental income on the Wasatch Front for a 1-bed basement unit ranges from '
        '<b>$900 to $1,500/month</b>.', s['body']))

    story.append(Paragraph('Compared to Standard Basement Finishes', s['h2']))
    compare_items = [
        'Natural light transforms the space from "basement" to "living area"',
        'Direct outdoor access makes the space independently usable',
        'ADU potential creates income that a standard finish cannot',
        'Appraisers value above-grade square footage 2\u20133x higher than below-grade',
    ]
    for item in compare_items:
        story.append(Paragraph(f'\u2022  {item}', s['bullet']))
    story.append(Spacer(1, 20))

    # ── COMMON PROBLEMS ──
    story.append(CondPageBreak(2 * inch))
    story.append(Paragraph('Common Problems &amp; How to Avoid Them', s['h1']))
    story.append(hr())
    story.extend(inline_image(
        'walkout-waterproofing.png', width=6.5 * inch,
        caption_text='Proper waterproofing: membrane, drainage tile, and gravel backfill '
                     'protect every walkout opening from water intrusion.',
        styles=s,
    ))

    problems = [
        ('Waterproofing Failures',
         'The biggest risk in any below-grade opening. Cutting into a foundation wall creates '
         'a new path for water. Every walkout requires exterior waterproofing membrane, proper '
         'drainage tile, and carefully engineered grading away from the opening.'),
        ('Structural Concerns',
         'You\'re cutting a hole in a load-bearing wall. This requires a structural engineer '
         'to design the header beam, support columns, and any reinforcement needed. Never let '
         'anyone cut a foundation without stamped engineering plans.'),
        ('Drainage Grading Mistakes',
         'The walkout area must drain away from the opening, not toward it. Incorrect grading '
         'is one of the most common issues. A 2% minimum slope away from the opening is standard.'),
        ('Permit and Inspection Issues',
         'A walkout conversion requires building permits, structural engineering, and multiple '
         'inspections. Skipping permits creates legal liability, insurance problems, and '
         'complications when you sell.'),
        ('Contractor Inexperience',
         'Walkout basements require structural engineering, excavation, foundation work, '
         'waterproofing, and finish carpentry. Many contractors are strong in one area but '
         'weak in others. Look for a contractor who has completed multiple walkout conversions.'),
    ]
    for i, (title, body) in enumerate(problems, 1):
        story.append(KeepTogether([
            Spacer(1, 4),
            NumberedItem(i, title, body, s),
            Spacer(1, 4),
        ]))

    callout = Paragraph(
        '<b>The pattern:</b> Walkout problems almost always trace back to inadequate '
        'engineering or waterproofing. These are the two areas where you cannot afford shortcuts.',
        s['callout'])
    story.append(ColorBlock(callout, LIGHT_GREEN, padding=14))
    story.append(Spacer(1, 20))

    # ── PROCESS ──
    story.append(KeepTogether([
        Paragraph('What to Expect: The Process', s['h1']),
        hr(),
        Spacer(1, 4),
        *inline_image(
            'walkout-construction.png', width=6.5 * inch,
            caption_text='Precision foundation cutting with steel header beam installation '
                         '\u2014 the structural core of every walkout conversion.',
            styles=s,
        ),
    ]))

    steps = [
        ('Consultation &amp; Feasibility Assessment',
         'We evaluate your foundation type, lot slope, soil conditions, and zoning '
         'requirements. Not every basement is a candidate \u2014 we\'ll tell you honestly.'),
        ('Structural Engineering',
         'A licensed structural engineer designs the opening: header beam specs, support '
         'column placement, foundation reinforcement, and load path analysis. You receive '
         'stamped plans.'),
        ('Permits &amp; Approvals',
         'BaseScape handles all permit applications, plan submissions, and inspection '
         'scheduling. For ADU conversions, we coordinate additional zoning or utility requirements.'),
        ('Excavation &amp; Foundation Work',
         'Exterior excavation to expose the foundation wall, precision cutting of the opening, '
         'header beam and support installation, and waterproofing membrane application.'),
        ('Waterproofing &amp; Drainage',
         'Exterior waterproofing, drainage tile installation, gravel backfill, and finish '
         'grading. This is the most critical phase for long-term performance.'),
        ('Framing, Finishing &amp; Restoration',
         'Door and window installation, interior framing, insulation, and finishes. Exterior '
         'landscape restoration and walkout area grading.'),
    ]
    for i, (title, body) in enumerate(steps, 1):
        story.append(KeepTogether([
            Spacer(1, 2),
            NumberedItem(i, title, body, s),
            Spacer(1, 2),
        ]))

    story.append(Spacer(1, 6))
    timeline = Paragraph(
        '<b>Typical timeline:</b> 6 to 12 weeks depending on scope and finish level. '
        'The structural and waterproofing phases take 2\u20133 weeks; finishing takes the remainder.',
        s['callout'])
    story.append(ColorBlock(timeline, LIGHT_AMBER, padding=14))
    story.append(Spacer(1, 20))
    story.append(CondPageBreak(3 * inch))

    # ── CONTRACTOR QUESTIONS ──
    story.append(Paragraph('Questions to Ask Any Contractor', s['h1']))
    story.append(hr())
    story.append(Paragraph(
        'Use this checklist when evaluating contractors for a walkout basement project:',
        s['body']))
    story.append(Spacer(1, 8))

    questions = [
        'Do you have a structural engineer on staff or on retainer?',
        'How many walkout basement conversions have you completed?',
        'What waterproofing system do you use, and what\'s the warranty?',
        'How do you handle drainage around the new opening?',
        'Are permits and engineering included in your bid?',
        'What\'s your timeline for the structural phase vs. the finish phase?',
        'Do you carry insurance that covers foundation and structural work?',
        'Can you provide references for similar walkout projects?',
        'What happens if the foundation reveals unexpected conditions?',
        'Will you handle ADU compliance if we want a rental unit?',
    ]
    for q in questions:
        story.append(Paragraph(f'\u2610  {q}', s['checklist']))
    story.append(Spacer(1, 12))

    story.append(Paragraph(
        '<b>Red flag:</b> If a contractor hasn\'t done walkout conversions specifically '
        '(not just basement finishes), they may not have the structural and waterproofing '
        'expertise this project requires.', s['redflag']))
    story.append(Spacer(1, 20))
    story.append(CondPageBreak(4 * inch))

    # ── CTA ──
    story.append(Spacer(1, 0.8 * inch))
    story.append(Paragraph('Ready to Get an Estimate?', s['cta_heading']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(
        'BaseScape specializes in walkout basement conversions<br/>'
        'across Utah\'s Wasatch Front.', s['cta_body']))
    story.append(Spacer(1, 20))
    story.append(Paragraph('(888) 414-0007', s['cta_phone']))
    story.append(Paragraph('basescapeutah.com/contact', s['cta_body']))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        'Licensed  |  Bonded  |  Insured<br/>'
        'Utah Contractor License #14082066-5501', s['cta_small']))
    story.append(Spacer(1, 24))
    story.append(Paragraph(
        'Free estimates. No pressure.<br/>'
        'We\'ll tell you honestly if your basement is a good candidate.',
        s['cta_tagline']))

    # Build with photo cover background
    cover_bg = make_cover_bg(os.path.join(IMG_DIR, 'walkout-cover.png'))
    doc.build(story, onFirstPage=cover_bg, onLaterPages=_footer)
    print(f'  Created: {output_path}')


def build_retaining_pdf(output_path):
    s = make_styles()
    doc = SimpleDocTemplate(
        output_path, pagesize=letter,
        leftMargin=inch, rightMargin=inch,
        topMargin=inch, bottomMargin=0.9 * inch,
        title="The Utah Homeowner's Guide to Retaining Walls",
        author='BaseScape',
    )
    story = []

    # ── COVER ──
    story.append(Spacer(1, 2.2 * inch))
    story.append(Paragraph("The Utah Homeowner's Guide to", s['cover_subtitle']))
    story.append(Paragraph('Retaining Walls', s['cover_title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph('Costs, Materials &amp; What to Expect', s['cover_subtitle']))
    story.append(Spacer(1, 1.8 * inch))
    story.append(Paragraph('A free resource from BaseScape', s['cover_footer']))
    story.append(Paragraph('Licensed  |  Bonded  |  Insured', s['cover_footer']))
    story.append(PageBreak())

    # ── PAGE 2: COSTS ──
    story.append(Paragraph('What Does a Retaining Wall Cost?', s['h1']))
    story.append(hr())
    story.append(Paragraph(
        'Retaining wall projects on Utah\'s Wasatch Front typically range from '
        '<b>$5,000 to $50,000+</b>. That\'s a wide range \u2014 here\'s what drives '
        'the number:', s['body']))
    story.append(Spacer(1, 6))

    cost_factors = [
        ('Wall height', 'is the biggest cost factor. A 2-foot garden wall is a fraction '
         'of the cost of an 8-foot structural wall. Taller walls require deeper footings, '
         'more material, and often structural engineering.'),
        ('Total linear footage', 'determines material volume. A 20-foot wall costs less '
         'than a 100-foot wall of the same height.'),
        ('Material selection', 'affects both material and labor costs. Natural stone is the '
         'most expensive. Architectural concrete block offers the best balance of durability '
         'and cost. Timber is cheapest but has the shortest lifespan.'),
        ('Site access', 'matters more than most homeowners expect. If equipment can\'t reach '
         'the wall location, manual labor increases costs significantly.'),
        ('Soil and drainage conditions', 'can add cost if the site requires extra drainage '
         'infrastructure, soil remediation, or geogrid reinforcement.'),
    ]
    for label, desc in cost_factors:
        story.append(Paragraph(f'\u2022  <b>{label}</b> {desc}', s['bullet']))
    story.append(Spacer(1, 10))

    story.append(Paragraph('Why We Share Pricing', s['h2']))
    story.append(Paragraph(
        'Most contractors won\'t put numbers on their website. We do because we believe '
        'you deserve to know what you\'re getting into before you pick up the phone. '
        'No surprises, no bait-and-switch.', s['body']))
    story.append(PageBreak())

    # ── PAGE 3: MATERIALS ──
    story.append(Paragraph('Materials Compared', s['h1']))
    story.append(hr())

    # Inline image: materials comparison
    story.extend(inline_image(
        'retaining-materials.png', width=6.5 * inch,
        caption_text='Concrete block, poured concrete, natural stone, and timber \u2014 '
                     'each material has distinct strengths for different applications.',
        styles=s,
    ))

    # Table
    header_style = s['table_header']
    cell_style = s['table_cell']
    bold_style = s['table_cell_bold']

    table_data = [
        [Paragraph('<b>Material</b>', header_style),
         Paragraph('<b>Lifespan</b>', header_style),
         Paragraph('<b>Cost</b>', header_style),
         Paragraph('<b>Best For</b>', header_style)],
        [Paragraph('Segmental Concrete Block', bold_style),
         Paragraph('50\u201375 years', cell_style),
         Paragraph('$$', cell_style),
         Paragraph('Most residential walls \u2014 durable, versatile, wide style selection', cell_style)],
        [Paragraph('Poured Concrete', bold_style),
         Paragraph('75\u2013100 years', cell_style),
         Paragraph('$$$', cell_style),
         Paragraph('Tall walls, modern aesthetics, maximum structural strength', cell_style)],
        [Paragraph('Natural Stone', bold_style),
         Paragraph('100+ years', cell_style),
         Paragraph('$$$$', cell_style),
         Paragraph('Premium landscapes, organic look, high curb appeal', cell_style)],
        [Paragraph('Timber', bold_style),
         Paragraph('15\u201320 years', cell_style),
         Paragraph('$', cell_style),
         Paragraph('Short garden walls, budget projects, rustic settings', cell_style)],
    ]
    col_widths = [1.6 * inch, 1.0 * inch, 0.7 * inch, 3.2 * inch]
    t = Table(table_data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('BACKGROUND', (0, 1), (-1, 1), LIGHT_BG),
        ('BACKGROUND', (0, 3), (-1, 3), LIGHT_BG),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#dde1e6')),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    rec = Paragraph(
        '<b>Our recommendation for most Utah homeowners:</b> Segmental concrete block. '
        'It handles freeze-thaw cycles well, comes in dozens of colors and textures, '
        'and offers the best value for walls under 6 feet.',
        s['callout'])
    story.append(ColorBlock(rec, LIGHT_GREEN, padding=14))
    story.append(PageBreak())

    # ── PAGE 4: COMMON PROBLEMS ──
    story.append(Paragraph('Common Problems &amp; How to Avoid Them', s['h1']))
    story.append(hr())

    # Inline image: cross-section diagram
    story.extend(inline_image(
        'retaining-crosssection.png', width=5.0 * inch,
        caption_text='Anatomy of a properly built retaining wall: compacted base, drainage, '
                     'geogrid reinforcement, and cap stones.',
        styles=s,
    ))

    problems = [
        ('Drainage Failure',
         'The #1 cause of retaining wall failure. Without proper drainage behind the wall, '
         'hydrostatic pressure builds up and pushes the wall outward. Every wall needs a '
         'French drain, gravel backfill, and weep holes.'),
        ('Inadequate Footings',
         'A retaining wall is only as strong as what it sits on. Proper footings require '
         'excavation below frost depth (36 inches in most of Utah) and a compacted gravel base. '
         'Skipping this leads to settling, cracking, and leaning.'),
        ('Missing Geogrid Reinforcement',
         'Walls over 4 feet need geogrid \u2014 layers of high-strength mesh buried in the '
         'backfill that anchor the wall to the soil behind it. Without geogrid, tall walls '
         'lean forward over time.'),
        ('No Permits',
         'In most Wasatch Front cities, walls over 4 feet require a building permit and '
         'engineered plans. Building without a permit can result in fines, mandatory demolition, '
         'or problems when you sell your home.'),
        ('Poor Compaction',
         'Every layer of backfill behind the wall must be mechanically compacted. Hand-tamping '
         'isn\'t sufficient. Poorly compacted backfill settles unevenly, creating pressure '
         'points that stress the wall.'),
    ]
    for i, (title, body) in enumerate(problems, 1):
        story.append(KeepTogether([
            Spacer(1, 2),
            NumberedItem(i, title, body, s),
            Spacer(1, 2),
        ]))

    callout = Paragraph(
        '<b>The pattern:</b> Most failures trace back to shortcuts during construction. '
        'Proper engineering, drainage, and compaction prevent virtually all retaining wall problems.',
        s['callout'])
    story.append(ColorBlock(callout, LIGHT_GREEN, padding=14))
    story.append(Spacer(1, 20))
    story.append(CondPageBreak(5 * inch))

    # ── PROCESS ──
    story.append(Paragraph('What to Expect: The Process', s['h1']))
    story.append(hr())

    # Inline image: construction
    story.extend(inline_image(
        'retaining-construction.png', width=6.5 * inch,
        caption_text='Precision block placement on a compacted gravel base with drainage '
                     'pipe already in position \u2014 the foundation of a wall built to last.',
        styles=s,
    ))

    steps = [
        ('Site Assessment &amp; Design',
         'We evaluate your terrain, soil composition, drainage patterns, and load requirements. '
         'You\'ll receive a detailed wall design with material options, height specifications, '
         'and a clear scope of work.'),
        ('Engineering &amp; Permits',
         'For walls over 4 feet, we provide structural engineering plans stamped by a licensed '
         'engineer. BaseScape handles all city permits, utility locates, and inspection scheduling.'),
        ('Excavation &amp; Construction',
         'Foundation preparation, compacted gravel base, drainage system installation, and '
         'precision block or stone placement. Every course is leveled and backfilled to '
         'engineered specifications.'),
        ('Finish &amp; Landscape Restoration',
         'Cap installation, final grading, backfill compaction, and landscape integration. '
         'Your new wall blends seamlessly with your existing yard and hardscape.'),
    ]
    for i, (title, body) in enumerate(steps, 1):
        story.append(KeepTogether([
            Spacer(1, 4),
            NumberedItem(i, title, body, s),
            Spacer(1, 6),
        ]))

    story.append(Spacer(1, 8))
    timeline = Paragraph(
        '<b>Typical timeline:</b> 1 to 3 weeks for most residential retaining walls, '
        'depending on wall size and site complexity.',
        s['callout'])
    story.append(ColorBlock(timeline, LIGHT_AMBER, padding=14))
    story.append(Spacer(1, 20))
    story.append(CondPageBreak(3 * inch))

    # ── CONTRACTOR QUESTIONS ──
    story.append(Paragraph('Questions to Ask Any Contractor', s['h1']))
    story.append(hr())
    story.append(Paragraph(
        'Use this checklist when getting estimates. A good contractor will answer these '
        'without hesitation:', s['body']))
    story.append(Spacer(1, 8))

    questions = [
        'Are you licensed, bonded, and insured in Utah?',
        'Will the wall be designed by a structural engineer?',
        'What drainage system is included in the bid?',
        'Are permits and inspections included in the price?',
        'What warranty do you offer on materials and labor?',
        'Will you use subcontractors, or is this your own crew?',
        'Can you provide references for similar retaining wall projects?',
        'What happens if we hit unexpected conditions (rock, water, utilities)?',
        'Is the estimate a fixed price or an approximation?',
        'What does the cleanup and restoration include?',
    ]
    for q in questions:
        story.append(Paragraph(f'\u2610  {q}', s['checklist']))
    story.append(Spacer(1, 12))

    story.append(Paragraph(
        '<b>Red flag:</b> If a contractor can\'t clearly answer the drainage and engineering '
        'questions, that tells you something about how they build walls.', s['redflag']))
    story.append(Spacer(1, 20))
    story.append(CondPageBreak(4 * inch))

    # ── CTA ──
    story.append(Spacer(1, 0.8 * inch))
    story.append(Paragraph('Ready to Get an Estimate?', s['cta_heading']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(
        'BaseScape specializes in engineered retaining walls<br/>'
        'across Utah\'s Wasatch Front.', s['cta_body']))
    story.append(Spacer(1, 20))
    story.append(Paragraph('(888) 414-0007', s['cta_phone']))
    story.append(Paragraph('basescapeutah.com/contact', s['cta_body']))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        'Licensed  |  Bonded  |  Insured<br/>'
        'Utah Contractor License #14082066-5501', s['cta_small']))
    story.append(Spacer(1, 24))
    story.append(Paragraph(
        'Free estimates. No pressure.<br/>'
        'We\'ll tell you honestly what your project needs.',
        s['cta_tagline']))

    # Build with photo cover background
    cover_bg = make_cover_bg(os.path.join(IMG_DIR, 'retaining-cover.png'))
    doc.build(story, onFirstPage=cover_bg, onLaterPages=_footer)
    print(f'  Created: {output_path}')


if __name__ == '__main__':
    out_dir = os.path.dirname(os.path.abspath(__file__))
    print('Generating BaseScape lead magnet PDFs...')
    build_walkout_pdf(os.path.join(out_dir, 'walkout-basements-guide.pdf'))
    build_retaining_pdf(os.path.join(out_dir, 'retaining-walls-guide.pdf'))
    print('Done.')
