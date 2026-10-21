"""Tests for the static site build."""

import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

import main

CALCULATOR_JS = Path(main.__file__).parent / "src" / "static" / "js" / "calculator.js"


class TagCollector(HTMLParser):
    """Collect the text of every element with a given tag name."""

    def __init__(self, tag):
        super().__init__()
        self.tag = tag
        self.depth = 0
        self.texts = []

    def handle_starttag(self, tag, attrs):
        if tag == self.tag:
            if self.depth == 0:
                self.texts.append("")
            self.depth += 1

    def handle_endtag(self, tag):
        if tag == self.tag and self.depth:
            self.depth -= 1

    def handle_data(self, data):
        if self.depth:
            self.texts[-1] += data


def collect(html, tag):
    parser = TagCollector(tag)
    parser.feed(html)
    return [" ".join(text.split()) for text in parser.texts]


def render_index():
    env = main.setup_jinja_env()
    return env.get_template("index.html").render(
        fall_asleep_minutes=main.FALL_ASLEEP_MINUTES,
        cycle_chart=main.build_cycle_chart(),
    )


def js_constant(name):
    match = re.search(rf"const {name} = (\d+);", CALCULATOR_JS.read_text())
    return int(match.group(1))


class CycleChartTest(unittest.TestCase):
    def test_constants_match_calculator_js(self):
        self.assertEqual(main.CYCLE_LENGTH_MINUTES, js_constant("CYCLE_LENGTH_MINUTES"))
        self.assertEqual(main.FALL_ASLEEP_MINUTES, js_constant("FALL_ASLEEP_MINUTES"))

    def test_bedtimes_count_back_whole_cycles_plus_buffer(self):
        chart = main.build_cycle_chart()
        self.assertEqual(chart["wake_times"], ["5:00 AM", "6:00 AM", "7:00 AM"])
        five_cycles = chart["rows"][4]
        self.assertEqual(five_cycles["cycles"], 5)
        self.assertEqual(five_cycles["hours"], "7.5")
        self.assertEqual(five_cycles["bedtimes"], ["9:16 PM", "10:16 PM", "11:16 PM"])

    def test_bedtimes_wrap_past_midnight(self):
        four_cycles = main.build_cycle_chart()["rows"][3]
        self.assertEqual(four_cycles["bedtimes"][2], "12:46 AM")


class IndexPageTest(unittest.TestCase):
    def setUp(self):
        self.html = render_index()

    def test_single_h1_names_target_phrase(self):
        self.assertEqual(collect(self.html, "h1"), ["90 Minute Sleep Cycle Calculator"])

    def test_about_anchor_targets_content_section(self):
        self.assertIn('id="about"', self.html)
        self.assertIn("What is the 90-minute sleep cycle?", collect(self.html, "h2"))

    def test_chart_is_server_rendered(self):
        cells = collect(self.html, "td")
        self.assertIn("9 h", cells)
        self.assertIn("9:46 PM", cells)

    def test_faq_questions_are_h3(self):
        questions = collect(self.html, "h3")
        self.assertIn("Is 90 minutes a full sleep cycle?", questions)
        self.assertIn("Is 7.5 hours of sleep enough?", questions)


if __name__ == "__main__":
    unittest.main()
