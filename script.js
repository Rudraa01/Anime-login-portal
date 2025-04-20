document.addEventListener('DOMContentLoaded', function() {
  const loginCard = document.getElementById('loginCard');
  const loginBtn = document.getElementById('loginBtn');
  const enterKingdomBtn = document.getElementById('enterKingdomBtn');
  const videoContainer = document.getElementById('videoContainer');
  const animeVideo = document.getElementById('animeVideo');

  // Function to force horizontal video display
  function setVideoOrientation() {
    // Force horizontal orientation regardless of video's natural dimensions
    // This is what the user specifically requested
    animeVideo.style.transform = 'translate(-50%, -50%) rotate(90deg)';
    animeVideo.style.width = '100vh'; // Use viewport height as width
    animeVideo.style.height = '100vw'; // Use viewport width as height
    animeVideo.style.maxWidth = 'none';
    animeVideo.style.maxHeight = 'none';
  }

  // Login button click event
  loginBtn.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation (you can customize this)
    if (username.trim() !== '' && password.trim() !== '') {
      // Hide login card with animation
      loginCard.style.transform = 'translateY(-50px) scale(0.8)';
      loginCard.style.opacity = '0';

      // Show enter kingdom button after a delay
      setTimeout(function() {
        loginCard.style.display = 'none';
        enterKingdomBtn.classList.add('visible');
      }, 500);
    } else {
      alert('Please enter both username and password!');
    }
  });

  // Enter Kingdom button click event
  enterKingdomBtn.addEventListener('click', function() {
    // Hide the button
    enterKingdomBtn.classList.remove('visible');

    // Show and play the video
    videoContainer.style.display = 'flex';

    // Force video to play at original quality without controls
    animeVideo.muted = false; // Enable sound
    animeVideo.controls = false; // Ensure no controls are shown

    // Set basic positioning styles
    animeVideo.style.position = 'absolute';
    animeVideo.style.top = '50%';
    animeVideo.style.left = '50%';
    animeVideo.style.objectFit = 'contain';
    animeVideo.style.zIndex = '10';
    
    // Add event listener to set orientation once metadata is loaded
    animeVideo.addEventListener('loadedmetadata', setVideoOrientation);
    
    // If metadata is already loaded, set orientation immediately
    if (animeVideo.readyState >= 1) {
      setVideoOrientation();
    }

    // Try to play the video with error handling
    const playPromise = animeVideo.play();

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Playback started successfully
        console.log('Video playback started');
        // Unmute after successful autoplay if needed
        // animeVideo.muted = false;
      })
      .catch(error => {
        // Auto-play was prevented or other error
        console.error('Video playback error:', error);
        // Alert the user to interact with the page
        alert('Please click anywhere on the screen to enable video playback with sound');
        
        // Add a click event listener to the document to play the video on user interaction
        document.addEventListener('click', function playVideoOnClick() {
          animeVideo.play();
          // Remove the event listener after it's been used
          document.removeEventListener('click', playVideoOnClick);
        }, { once: true });
      });
    }

    // Hide background if it's an image
    const bgImage = document.querySelector('.background-image');
    if (bgImage) {
      bgImage.style.opacity = '0';
    }
  });
});
