"""
PowerPoint Presentation Generator for Video Chat Application
Automatically creates slides based on the presentation content outlined in markdown files.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SHAPE_TYPE
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
import os
from datetime import datetime

class VideoChatPresentationGenerator:
    def __init__(self):
        """Initialize the presentation generator with styling configurations."""
        self.prs = Presentation()
        
        # Color scheme (matching presentation-assets.md)
        self.colors = {
            'deep_blue': RGBColor(30, 58, 138),      # #1e3a8a
            'bright_orange': RGBColor(249, 115, 22),  # #f97316
            'clean_white': RGBColor(255, 255, 255),   # #ffffff
            'dark_gray': RGBColor(55, 65, 81),        # #374151
            'light_gray': RGBColor(243, 244, 246),    # #f3f4f6
            'light_blue': RGBColor(59, 130, 246)      # #3b82f6
        }
        
        # Font sizes (converted to points)
        self.font_sizes = {
            'title': Pt(60),
            'header': Pt(44),
            'body': Pt(32),
            'caption': Pt(24)
        }
        
        # Slide dimensions
        self.slide_width = Inches(13.33)  # 16:9 aspect ratio
        self.slide_height = Inches(7.5)
        
    def set_slide_background(self, slide, color=None):
        """Set slide background color."""
        if color:
            background = slide.background
            fill = background.fill
            fill.solid()
            fill.fore_color.rgb = color
            
    def add_title_slide(self):
        """Create the title slide."""
        slide_layout = self.prs.slide_layouts[0]  # Title slide layout
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Set background
        self.set_slide_background(slide, self.colors['deep_blue'])
        
        # Title
        title = slide.shapes.title
        title.text = "The Future of Learning: When Videos Talk Back"
        title_frame = title.text_frame
        title_para = title_frame.paragraphs[0]
        title_para.font.size = self.font_sizes['title']
        title_para.font.color.rgb = self.colors['clean_white']
        title_para.font.bold = True
        title_para.alignment = PP_ALIGN.CENTER
        
        # Subtitle
        subtitle = slide.shapes.placeholders[1]
        subtitle.text = "Transforming One-Way Video Learning into Interactive Conversations"
        subtitle_frame = subtitle.text_frame
        subtitle_para = subtitle_frame.paragraphs[0]
        subtitle_para.font.size = self.font_sizes['body']
        subtitle_para.font.color.rgb = self.colors['bright_orange']
        subtitle_para.alignment = PP_ALIGN.CENTER
        
        # Add date and presenter info
        date_box = slide.shapes.add_textbox(
            Inches(10), Inches(6), Inches(3), Inches(1)
        )
        date_frame = date_box.text_frame
        date_para = date_frame.paragraphs[0]
        date_para.text = f"June 20, 2025\nPresented by: [Your Name]"
        date_para.font.size = self.font_sizes['caption']
        date_para.font.color.rgb = self.colors['clean_white']
        date_para.alignment = PP_ALIGN.RIGHT
        
        return slide
    
    def add_content_slide(self, title_text, content_points, slide_type="bullet"):
        """Add a content slide with title and bullet points or custom content."""
        slide_layout = self.prs.slide_layouts[1]  # Title and content layout
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Title
        title = slide.shapes.title
        title.text = title_text
        title_frame = title.text_frame
        title_para = title_frame.paragraphs[0]
        title_para.font.size = self.font_sizes['header']
        title_para.font.color.rgb = self.colors['deep_blue']
        title_para.font.bold = True
        
        # Content
        if slide_type == "bullet":
            content = slide.shapes.placeholders[1]
            content_frame = content.text_frame
            content_frame.clear()
            
            for i, point in enumerate(content_points):
                if i == 0:
                    para = content_frame.paragraphs[0]
                else:
                    para = content_frame.add_paragraph()
                
                para.text = point
                para.font.size = self.font_sizes['body']
                para.font.color.rgb = self.colors['dark_gray']
                para.level = 0
                
        return slide
    
    def add_hook_slide(self):
        """Create the opening hook slide."""
        slide = self.add_content_slide(
            "Did You Know?",
            [
                "🙋 Average person watches 17 hours of video content weekly",
                "😕 Most learning videos are one-way communication",
                "🤔 What if your videos could talk back?"
            ]
        )
        
        # Add large question mark or engaging visual element
        # (In a real implementation, you might add shapes or images here)
        return slide
    
    def add_problem_slide(self):
        """Create the problem statement slide."""
        slide = self.add_content_slide(
            "The Learning Problem",
            [
                "📺 Learning = One-Way Street",
                "❓ Questions? → Rewind → Research → Lost Focus",
                "⏰ Time wasted searching for specific information",
                "😤 Frustration when videos can't answer back"
            ]
        )
        return slide
    
    def add_vision_slide(self):
        """Create the vision slide."""
        slide = self.add_content_slide(
            "The Vision",
            [
                "💡 From Monologue → Conversation",
                "🎯 Interactive Learning Experience",
                "🤖 AI-Powered Video Companion",
                "❓ What if the video could answer your questions?"
            ]
        )
        return slide
    
    def add_solution_slide(self):
        """Create the solution introduction slide."""
        slide = self.add_content_slide(
            "Introducing Video Chat App",
            [
                "🎬 Any YouTube Video → Intelligent Companion",
                "🧠 Powered by AI & Built for Learners",
                "💬 Chat about anything in the video",
                "⚡ Science fiction that runs on your laptop today"
            ]
        )
        return slide
    
    def add_how_it_works_slide(self):
        """Create the how it works slide."""
        slide_layout = self.prs.slide_layouts[1]
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Title
        title = slide.shapes.title
        title.text = "How It Works"
        title_frame = title.text_frame
        title_para = title_frame.paragraphs[0]
        title_para.font.size = self.font_sizes['header']
        title_para.font.color.rgb = self.colors['deep_blue']
        title_para.font.bold = True
        
        # Create three-step process boxes
        steps = [
            ("1", "Paste YouTube URL", Inches(1), self.colors['bright_orange']),
            ("2", "AI Extracts & Analyzes", Inches(5), self.colors['light_blue']),
            ("3", "Chat About Content", Inches(9), self.colors['deep_blue'])
        ]
        
        for step_num, step_text, x_pos, color in steps:
            # Step number circle
            circle = slide.shapes.add_shape(
                MSO_SHAPE.OVAL, x_pos, Inches(2), Inches(1), Inches(1)
            )
            circle.fill.solid()
            circle.fill.fore_color.rgb = color
            circle.line.color.rgb = color
            
            # Step number text
            circle_frame = circle.text_frame
            circle_para = circle_frame.paragraphs[0]
            circle_para.text = step_num
            circle_para.font.size = self.font_sizes['body']
            circle_para.font.color.rgb = self.colors['clean_white']
            circle_para.font.bold = True
            circle_para.alignment = PP_ALIGN.CENTER
            circle_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
            
            # Step description
            text_box = slide.shapes.add_textbox(
                x_pos - Inches(0.5), Inches(3.5), Inches(2), Inches(1)
            )
            text_frame = text_box.text_frame
            text_para = text_frame.paragraphs[0]
            text_para.text = step_text
            text_para.font.size = self.font_sizes['caption']
            text_para.font.color.rgb = self.colors['dark_gray']
            text_para.alignment = PP_ALIGN.CENTER
        
        return slide
    
    def add_features_slide(self):
        """Create the key features slide."""
        slide = self.add_content_slide(
            "Key Features",
            [
                "🎯 Contextual AI Chat - Answers based on video content",
                "⏱️ Auto-Generated Timestamps - AI creates chapter markers",
                "🔍 Instant Content Search - Find anything in seconds",
                "📺 Universal Compatibility - Works with ANY YouTube video"
            ]
        )
        return slide
    
    def add_demo_slide(self):
        """Create the demo slide (placeholder)."""
        slide_layout = self.prs.slide_layouts[6]  # Blank layout
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Title
        title_box = slide.shapes.add_textbox(
            Inches(4), Inches(1), Inches(5), Inches(1)
        )
        title_frame = title_box.text_frame
        title_para = title_frame.paragraphs[0]
        title_para.text = "See It In Action"
        title_para.font.size = self.font_sizes['header']
        title_para.font.color.rgb = self.colors['deep_blue']
        title_para.font.bold = True
        title_para.alignment = PP_ALIGN.CENTER
        
        # Demo placeholder
        demo_box = slide.shapes.add_textbox(
            Inches(2), Inches(3), Inches(9), Inches(2)
        )
        demo_frame = demo_box.text_frame
        demo_para = demo_frame.paragraphs[0]
        demo_para.text = "[Live Demo or Screen Recording]\n\nShow: URL Input → Processing → Chat Interaction"
        demo_para.font.size = self.font_sizes['body']
        demo_para.font.color.rgb = self.colors['dark_gray']
        demo_para.alignment = PP_ALIGN.CENTER
        demo_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
        
        # Add border for demo area
        demo_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(1.5), Inches(2.5), Inches(10), Inches(3)
        )
        demo_shape.fill.background()
        demo_shape.line.color.rgb = self.colors['light_blue']
        demo_shape.line.width = Pt(2)
        
        return slide
    
    def add_special_features_slide(self):
        """Create the 'what makes it special' slide."""
        slide = self.add_content_slide(
            "What Makes It Special",
            [
                "🌍 Universal Compatibility - No special setup needed",
                "🧠 Context-Aware Intelligence - Real video understanding",
                "❤️ Built by Learners, for Learners - Solving real problems"
            ]
        )
        return slide
    
    def add_impact_slide(self):
        """Create the impact slide."""
        slide = self.add_content_slide(
            "The Impact We're Creating",
            [
                "🔄 Making Every Video Interactive",
                "💡 Turning Confusion into Understanding",
                "🌉 Breaking Learning Barriers",
                "🚀 Transforming Education Technology"
            ]
        )
        return slide
    
    def add_closing_slide(self):
        """Create the closing statement slide."""
        slide_layout = self.prs.slide_layouts[6]  # Blank layout
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Set inspiring background
        self.set_slide_background(slide, self.colors['deep_blue'])
        
        # Main quote
        quote_box = slide.shapes.add_textbox(
            Inches(1), Inches(2), Inches(11.33), Inches(3)
        )
        quote_frame = quote_box.text_frame
        quote_frame.clear()
        
        # First line
        para1 = quote_frame.paragraphs[0]
        para1.text = "Learning shouldn't be a monologue."
        para1.font.size = self.font_sizes['header']
        para1.font.color.rgb = self.colors['clean_white']
        para1.font.bold = True
        para1.alignment = PP_ALIGN.CENTER
        
        # Second line
        para2 = quote_frame.add_paragraph()
        para2.text = "It should be a conversation."
        para2.font.size = self.font_sizes['header']
        para2.font.color.rgb = self.colors['bright_orange']
        para2.font.bold = True
        para2.alignment = PP_ALIGN.CENTER
        
        # Third line
        para3 = quote_frame.add_paragraph()
        para3.text = "And now, finally, it can be."
        para3.font.size = self.font_sizes['header']
        para3.font.color.rgb = self.colors['clean_white']
        para3.font.bold = True
        para3.alignment = PP_ALIGN.CENTER
        
        return slide
    
    def add_thank_you_slide(self):
        """Create the thank you slide."""
        slide_layout = self.prs.slide_layouts[0]  # Title slide layout
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Title
        title = slide.shapes.title
        title.text = "Thank You"
        title_frame = title.text_frame
        title_para = title_frame.paragraphs[0]
        title_para.font.size = self.font_sizes['title']
        title_para.font.color.rgb = self.colors['deep_blue']
        title_para.font.bold = True
        title_para.alignment = PP_ALIGN.CENTER
        
        # Subtitle with questions
        subtitle = slide.shapes.placeholders[1]
        subtitle.text = "Questions?\n\nDemo available at: [your-demo-link]\nContact: [your-email]"
        subtitle_frame = subtitle.text_frame
        subtitle_para = subtitle_frame.paragraphs[0]
        subtitle_para.font.size = self.font_sizes['body']
        subtitle_para.font.color.rgb = self.colors['dark_gray']
        subtitle_para.alignment = PP_ALIGN.CENTER
        
        return slide
    
    def generate_presentation(self, output_path="video_chat_presentation.pptx"):
        """Generate the complete presentation."""
        print("🎬 Starting presentation generation...")
        
        # Create all slides in order
        slides_created = []
        
        print("📝 Creating title slide...")
        slides_created.append(self.add_title_slide())
        
        print("📝 Creating hook slide...")
        slides_created.append(self.add_hook_slide())
        
        print("📝 Creating problem slide...")
        slides_created.append(self.add_problem_slide())
        
        print("📝 Creating vision slide...")
        slides_created.append(self.add_vision_slide())
        
        print("📝 Creating solution slide...")
        slides_created.append(self.add_solution_slide())
        
        print("📝 Creating how it works slide...")
        slides_created.append(self.add_how_it_works_slide())
        
        print("📝 Creating features slide...")
        slides_created.append(self.add_features_slide())
        
        print("📝 Creating demo slide...")
        slides_created.append(self.add_demo_slide())
        
        print("📝 Creating special features slide...")
        slides_created.append(self.add_special_features_slide())
        
        print("📝 Creating impact slide...")
        slides_created.append(self.add_impact_slide())
        
        print("📝 Creating closing slide...")
        slides_created.append(self.add_closing_slide())
        
        print("📝 Creating thank you slide...")
        slides_created.append(self.add_thank_you_slide())
        
        # Save presentation
        print(f"💾 Saving presentation to {output_path}...")
        self.prs.save(output_path)
        
        print(f"✅ Presentation generated successfully!")
        print(f"📊 Total slides created: {len(slides_created)}")
        print(f"📁 File saved as: {output_path}")
        
        return output_path

def main():
    """Main function to generate the presentation."""
    print("🎯 Video Chat Application - PowerPoint Generator")
    print("=" * 50)
    
    # Create generator instance
    generator = VideoChatPresentationGenerator()
    
    # Set output path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "Video_Chat_Application_Presentation.pptx")
    
    try:
        # Generate presentation
        final_path = generator.generate_presentation(output_path)
        
        print("\n🎉 SUCCESS!")
        print(f"📁 Your presentation is ready: {final_path}")
        print("\n📋 Next steps:")
        print("1. Open the PowerPoint file")
        print("2. Review and customize the content")
        print("3. Add your personal details (name, contact info)")
        print("4. Practice with the delivery guide")
        print("5. Add any demo videos or screenshots")
        
        print("\n💡 Pro tips:")
        print("- Test the slides on your presentation equipment")
        print("- Practice the timing (aim for 3 minutes)")
        print("- Prepare for Q&A using the markdown guides")
        print("- Consider creating a backup PDF version")
        
    except Exception as e:
        print(f"❌ Error generating presentation: {str(e)}")
        print("🔧 Make sure you have python-pptx installed:")
        print("   pip install python-pptx")
        return False
    
    return True

if __name__ == "__main__":
    main()
