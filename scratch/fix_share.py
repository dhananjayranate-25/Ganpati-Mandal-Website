import re

def fix_share_custom_poster():
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            content = f.read()

        # Find the block where `customText` is defined in captureCustomPoster
        # It starts with "let customText = '';" and ends before "const textContainerWrapper ="
        match = re.search(r'(let customText = \'\';.*?)(?=const textContainerWrapper =)', content, re.DOTALL)
        if not match:
            print("Could not find customText block")
            return
            
        customTextCode = match.group(1).strip()
        
        # Now find the place to insert it inside shareCustomPoster
        # specifically, right before `const shareData = {`
        share_data_match = re.search(r'const shareData = \{\s*title: orgName \+ \' - \' \+ titleStr,\s*text: `\$\{customText\}.*?\};', content, re.DOTALL)
        if not share_data_match:
            print("Could not find shareData block in shareCustomPoster")
            return
            
        shareDataCode = share_data_match.group(0)
        
        # We need to make sure we only replace it in shareCustomPoster
        parts = content.split('async function shareCustomPoster(type, btn) {')
        
        if len(parts) > 1:
            custom_share = parts[1]
            
            # Replace shareData block with customText block + shareData block
            new_share_data = customTextCode + "\n\n                      " + shareDataCode
            
            new_custom_share = custom_share.replace(shareDataCode, new_share_data)
            
            content = parts[0] + 'async function shareCustomPoster(type, btn) {' + new_custom_share
            
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(content)
            print("Successfully fixed shareCustomPoster")
        else:
            print("Function shareCustomPoster not found")

    except Exception as e:
        print(f"Error: {e}")

fix_share_custom_poster()
