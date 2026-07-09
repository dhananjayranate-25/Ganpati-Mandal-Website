
    const API_URL = '';
    let uploadedPDFsData = [];
    let uploadedPDFsPage = 0;
    let yearVisibilityMap = {};
    let appSettings = {};

    function getPDFSettings(year) {
        const defaults = { orgName: 'शिवसृष्टी सार्वजनिक उत्सव मंडळ संगमनेर 🚩', subtitle: 'गणेश उत्सव कॅशबुक', tagline: 'Ganpati Festival Cashbook', headerOrgName: '', headerSubtitle: '' };