#!/usr/bin/env python3
"""Sleep Calculator - Static Site Generator

Builds the static site using Jinja2 templates
"""

import shutil
from datetime import datetime
from datetime import timedelta
from pathlib import Path

from jinja2 import Environment
from jinja2 import FileSystemLoader

CYCLE_LENGTH_MINUTES = 90
FALL_ASLEEP_MINUTES = 14
CHART_CYCLES = range(1, 7)
CHART_WAKE_TIMES = ("05:00", "06:00", "07:00")


def format_clock(moment):
    """Format a datetime as a 12-hour clock time, e.g. "10:46 PM"."""
    return moment.strftime("%I:%M %p").lstrip("0")


def build_cycle_chart():
    """Build the static 90-minute sleep cycle chart.

    Uses the same arithmetic as calculator.js: a bedtime is the wake time
    minus whole 90-minute cycles minus the fall-asleep buffer.
    """
    wake_times = [datetime.strptime(t, "%H:%M") for t in CHART_WAKE_TIMES]
    rows = []
    for cycles in CHART_CYCLES:
        asleep = timedelta(minutes=cycles * CYCLE_LENGTH_MINUTES)
        in_bed = asleep + timedelta(minutes=FALL_ASLEEP_MINUTES)
        rows.append(
            {
                "cycles": cycles,
                "hours": f"{asleep.total_seconds() / 3600:g}",
                "bedtimes": [format_clock(wake - in_bed) for wake in wake_times],
            }
        )
    return {
        "wake_times": [format_clock(wake) for wake in wake_times],
        "rows": rows,
    }


def setup_jinja_env():
    """Initialize Jinja2 environment with template loader"""
    template_dir = Path(__file__).parent / "src" / "templates"
    env = Environment(
        loader=FileSystemLoader(str(template_dir)),
        autoescape=True,
        trim_blocks=True,
        lstrip_blocks=True,
    )
    return env


def ensure_build_dirs():
    """Create build directory structure"""
    build_dir = Path(__file__).parent / "build"
    static_dir = build_dir / "static"

    build_dir.mkdir(exist_ok=True)
    (static_dir / "css").mkdir(parents=True, exist_ok=True)
    (static_dir / "js").mkdir(parents=True, exist_ok=True)
    (static_dir / "images").mkdir(parents=True, exist_ok=True)
    (static_dir / "fonts").mkdir(parents=True, exist_ok=True)

    return build_dir


def copy_static_assets():
    """Copy static assets to build directory"""
    src_static = Path(__file__).parent / "src" / "static"
    build_static = Path(__file__).parent / "build" / "static"

    js_src = src_static / "js"
    js_dest = build_static / "js"
    if js_src.exists():
        for js_file in js_src.glob("*.js"):
            shutil.copy2(js_file, js_dest / js_file.name)
            print(f"Copied {js_file.name}")

    fonts_src = src_static / "fonts"
    fonts_dest = build_static / "fonts"
    if fonts_src.exists():
        for font_file in fonts_src.glob("*.woff2"):
            shutil.copy2(font_file, fonts_dest / font_file.name)
            print(f"Copied {font_file.name}")

    img_src = src_static / "images"
    img_dest = build_static / "images"
    if img_src.exists() and any(img_src.iterdir()):
        for img_file in img_src.iterdir():
            if img_file.is_file():
                shutil.copy2(img_file, img_dest / img_file.name)
                print(f"Copied {img_file.name}")


def render_template(env, template_name, output_path, context=None):
    """Render a Jinja2 template and write to file"""
    if context is None:
        context = {}

    template = env.get_template(template_name)
    html = template.render(**context)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Generated {output_path}")


def build_site():
    """Main build function"""
    print("Building Sleep Calculator...")

    env = setup_jinja_env()
    build_dir = ensure_build_dirs()

    print("\nCopying static assets...")
    copy_static_assets()

    print("\nGenerating HTML pages...")
    context = {
        "title": "Sleep Calculator - Find Your Perfect Bedtime",
        "description": (
            "Calculate optimal sleep and wake times based on 90-minute sleep cycles"
        ),
        "fall_asleep_minutes": FALL_ASLEEP_MINUTES,
        "cycle_chart": build_cycle_chart(),
    }
    render_template(env, "index.html", build_dir / "index.html", context)

    print("\n✓ Build complete!")
    print(f"Output directory: {build_dir}")


if __name__ == "__main__":
    build_site()
