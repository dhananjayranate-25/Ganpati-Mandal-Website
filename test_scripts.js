
    // Auto-wrap tables for mobile responsiveness
    document.addEventListener('DOMContentLoaded', function() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    });
    



                    let currentMemberCount = 9;
                    
                    function generateMemberForm(i) {
                        return `
                        <div class="upload-container" style="margin-bottom: 20px;" id="member${i}Container">
                            <h3 style="margin-bottom: 15px; color: var(--text-primary);">Member ${i} (सदस्य)</h3>
                            <div class="form-grid">
                                <div class="form-group floating-label">
                                    <input type="text" id="member${i}Name" placeholder=" ">
                                    <label for="member${i}Name">Name</label>
                                    <div class="input-focus-line"></div>
                                </div>
                                <div class="form-group floating-label">
                                    <input type="text" id="member${i}Mobile" placeholder=" ">
                                    <label for="member${i}Mobile">Mobile Number</label>
                                    <div class="input-focus-line"></div>
                                </div>
                                <div class="form-group floating-label">
                                    <input type="text" id="member${i}Designation" placeholder=" " class="form-control" style="width:100%; padding:10px; border-radius:10px; background:var(--bg-card); border:1px solid var(--glass-border); color:var(--text-primary);">
                                    <label for="member${i}Designation">Post / Designation टाईप करा</label>
                                    <div class="input-focus-line"></div>
                                </div>
                            </div>
                            <div style="margin-top: 15px;">
                                <label style="color: var(--text-secondary); font-size: 12px; display: block; margin-bottom: 5px;">Member ${i} Photo</label>
                                <input type="file" id="member${i}PhotoInput" accept="image/*" style="padding: 8px; border-radius: 10px; background: var(--bg-card); border: 2px dashed var(--glass-border); color: var(--text-primary); cursor: pointer; width: 100%;">
                            </div>
                            <div style="margin-top: 20px;">
                                <button class="btn btn-primary ripple" onclick="saveCommitteeMember('member${i}')" style="background: linear-gradient(135deg, #10b981, #059669);">Save Member ${i}</button>
                                <button class="btn btn-primary ripple" onclick="deleteCommitteeMember('member${i}')" style="background: linear-gradient(135deg, #ef4444, #dc2626); margin-left: 10px;">Delete</button>
                                <span id="member${i}Status" style="font-size:14px; margin-left:10px;"></span>
                            </div>
                        </div>
                        `;
                    }

                    function renderExtraMembers() {
                        const container = document.getElementById('extra-members-container');
                        let html = '';
                        for(let i=1; i<=currentMemberCount; i++) {
                            html += generateMemberForm(i);
                        }
                        container.innerHTML = html;
                    }

                    function addNewMemberSlot() {
                        currentMemberCount++;
                        const container = document.getElementById('extra-members-container');
                        container.insertAdjacentHTML('beforeend', generateMemberForm(currentMemberCount));
                    }

                    document.addEventListener('DOMContentLoaded', () => {
                        renderExtraMembers();
                    });
                


window.deletePDF = deletePDF;
window.uploadPDF = uploadPDF;
window.viewMergedPDF = viewMergedPDF;
window.downloadMergedPDF = downloadMergedPDF;
window.renamePDF = renamePDF;
window.editPdfCover = editPdfCover;
window.switchYearTab = switchYearTab;
window.switchAdminTab = switchAdminTab;


