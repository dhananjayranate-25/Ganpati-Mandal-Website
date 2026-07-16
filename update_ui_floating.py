import sys

def get_new_niyojan_form(id_prefix):
    return f"""
                        <form onsubmit="addNiyojan(event)">
                            <div class="form-group floating-label">
                                <input type="date" id="{id_prefix}NiyojanDate" placeholder=" " required>
                                <label for="{id_prefix}NiyojanDate">तारीख</label>
                            </div>
                            <div class="form-group floating-label">
                                <input type="time" id="{id_prefix}NiyojanTime" placeholder=" " required>
                                <label for="{id_prefix}NiyojanTime">वेळ</label>
                            </div>
                            <div class="form-group floating-label">
                                <input type="text" id="{id_prefix}NiyojanTitle" placeholder=" " required>
                                <label for="{id_prefix}NiyojanTitle">कार्यक्रमाचे नाव</label>
                            </div>
                            <div class="form-group floating-label">
                                <textarea id="{id_prefix}NiyojanDesc" placeholder=" " rows="3"></textarea>
                                <label for="{id_prefix}NiyojanDesc">अधिक माहिती (पर्यायी)</label>
                            </div>
                            <button type="submit" class="btn">नियोजन जोडा</button>
                        </form>"""

def get_new_aarti_form(id_prefix):
    return f"""
                        <form onsubmit="addAarti(event)">
                            <div class="form-group floating-label">
                                <input type="text" id="{id_prefix}AartiName" placeholder=" " required>
                                <label for="{id_prefix}AartiName">नाव</label>
                            </div>
                            <div class="form-group floating-label">
                                <input type="date" id="{id_prefix}AartiDate" placeholder=" " required>
                                <label for="{id_prefix}AartiDate">तारीख</label>
                            </div>
                            <div class="form-group floating-label select-group">
                                <select id="{id_prefix}AartiTime" required>
                                    <option value="सकाळ">सकाळ</option>
                                    <option value="संध्याकाळ">संध्याकाळ</option>
                                </select>
                                <label for="{id_prefix}AartiTime">वेळ (सकाळ/संध्याकाळ)</label>
                            </div>
                            <div class="form-group floating-label">
                                <input type="text" id="{id_prefix}AartiPhone" placeholder=" ">
                                <label for="{id_prefix}AartiPhone">फोन नंबर</label>
                            </div>
                            <div class="form-group floating-label">
                                <textarea id="{id_prefix}AartiDetails" placeholder=" " rows="3"></textarea>
                                <label for="{id_prefix}AartiDetails">पूजा माहिती</label>
                            </div>
                            <button type="submit" class="btn">आरती जोडा</button>
                        </form>"""

def update_file(filename, prefix):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    import re
    niyojan_pattern = r'<form onsubmit="addNiyojan\(event\)"[^>]*>.*?</form>'
    content = re.sub(niyojan_pattern, get_new_niyojan_form(prefix).strip(), content, flags=re.DOTALL)

    aarti_pattern = r'<form onsubmit="addAarti\(event\)"[^>]*>.*?</form>'
    content = re.sub(aarti_pattern, get_new_aarti_form(prefix).strip(), content, flags=re.DOTALL)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated forms in {filename}")

update_file('member.html', '')
update_file('superadmin.html', 'sa')
