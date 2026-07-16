import re

with open('member.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Niyojan
content = content.replace(
    """if(data.success) {
                    let myNiyojan = data.niyojan.filter(n => n.addedBy === currentUser.name);""",
    """if(Array.isArray(data) || data.success) {
                    let niyojanList = Array.isArray(data) ? data : data.niyojan;
                    let myNiyojan = niyojanList.filter(n => n.addedBy === currentUser.name);"""
)

# Fix Aarti
content = content.replace(
    """if(data.success) {
                    let myAarti = data.aarti.filter(a => a.addedBy === currentUser.name);""",
    """if(Array.isArray(data) || data.success) {
                    let aartiList = Array.isArray(data) ? data : data.aarti;
                    let myAarti = aartiList.filter(a => a.addedBy === currentUser.name);"""
)

with open('member.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed loadMyData JSON response parsing in member.html')
