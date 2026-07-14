      async function captureDonationPoster() {
          const card = document.querySelector('.donation-card');
          
          // Create an off-screen clone so the mobile view doesn't glitch
          const clone = card.cloneNode(true);
          clone.style.position = 'absolute';
          clone.style.left = '-9999px';
          clone.style.top = '-9999px';
          // Force desktop layout for the clone
          clone.style.width = '1000px';
          clone.style.maxWidth = '1000px';
          clone.style.display = 'flex';
          clone.style.flexDirection = 'row';
          clone.style.background = '#1a1a1a';
          clone.style.alignItems = 'center';
          clone.style.padding = '30px';
          document.body.appendChild(clone);
          
          const actions = clone.querySelector('#donationActions');
          const title = clone.querySelector('.section-title');
          
          if(actions) actions.style.display = 'none';
          if(title) title.style.display = 'none';
          
          const mandalPoster = document.createElement('img');
          mandalPoster.style.width = '100%';
          mandalPoster.style.height = 'auto';
          mandalPoster.style.borderRadius = '15px';
          mandalPoster.style.marginBottom = '25px';
          mandalPoster.style.display = 'block';
          mandalPoster.style.objectFit = 'contain';
  
          await new Promise((resolve) => {
              mandalPoster.onload = resolve;
              mandalPoster.onerror = resolve; 
              mandalPoster.src = 'logo/Receipt.jpeg'; 
              clone.insertBefore(mandalPoster, clone.firstChild);
          });
          
          const tempWebsiteUrl = document.createElement('div');
          tempWebsiteUrl.style.color = '#fff';
          tempWebsiteUrl.style.textAlign = 'center';
          tempWebsiteUrl.style.fontSize = '16px';
          tempWebsiteUrl.style.marginBottom = '25px';
          tempWebsiteUrl.style.marginTop = '-5px';
          tempWebsiteUrl.style.fontFamily = "'Poppins', sans-serif";
          tempWebsiteUrl.innerHTML = 'अधिकृत वेबसाईट: <span style="color: #ffd700;">https://shivsrushti-utsav-mandal.onrender.com</span>';
          clone.insertBefore(tempWebsiteUrl, mandalPoster.nextSibling);
          
          const canvas = await html2canvas(clone, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#1a1a1a',
              windowWidth: 1200
          });
          
          document.body.removeChild(clone);
          return canvas;
      }
