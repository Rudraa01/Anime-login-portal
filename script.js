document.addEventListener('DOMContentLoaded', function() {
  // Listen for orientation changes
  window.addEventListener('orientationchange', function() {
    // Wait for orientation change to complete
    setTimeout(function() {
      const videoElement = document.getElementById('animeVideo');
      if (videoElement && videoContainer.style.display === 'flex') {
        setVideoOrientation();
      }
    }, 300);
  });

  // Listen for resize events (for desktop testing)
  window.addEventListener('resize', function() {
    const videoElement = document.getElementById('animeVideo');
    if (videoElement && videoContainer.style.display === 'flex') {
      setVideoOrientation();
    }
  });

  const loginCard = document.getElementById('loginCard');
  const loginBtn = document.getElementById('loginBtn');
  const enterKingdomBtn = document.getElementById('enterKingdomBtn');
  const videoContainer = document.getElementById('videoContainer');
  const animeVideo = document.getElementById('animeVideo');

  // Function to handle video orientation based on device
  function setVideoOrientation() {
    // Check if device is in portrait mode (mobile)
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      if (isPortrait) {
        // Mobile in portrait mode
        animeVideo.style.transform = 'translate(-50%, -50%) rotate(90deg)';
        animeVideo.style.width = '100vh';
        animeVideo.style.height = '100vw';
      } else {
        // Mobile in landscape mode
        animeVideo.style.transform = 'translate(-50%, -50%)';
        animeVideo.style.width = '100vw';
        animeVideo.style.height = 'auto';
        animeVideo.style.maxHeight = '100vh';
      }
    } else {
      // Desktop - force horizontal as requested
      animeVideo.style.transform = 'translate(-50%, -50%) rotate(90deg)';
      animeVideo.style.width = '100vh';
      animeVideo.style.height = '100vw';
    }

    animeVideo.style.maxWidth = 'none';
    animeVideo.style.objectFit = 'contain';
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
        alert('Please tap or click anywhere on the screen to enable video playback with sound');

        // Function to play video on user interaction
        function playVideoOnInteraction() {
          animeVideo.play();
          // Remove all event listeners after one is used
          document.removeEventListener('click', playVideoOnInteraction);
          document.removeEventListener('touchend', playVideoOnInteraction);
        }

        // Add event listeners for both click and touch events
        document.addEventListener('click', playVideoOnInteraction, { once: true });
        document.addEventListener('touchend', playVideoOnInteraction, { once: true });
      });
    }

    // Hide background if it's an image
    const bgImage = document.querySelector('.background-image');
    if (bgImage) {
      bgImage.style.opacity = '0';
    }
  });
});
