import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  const messageBox = document.getElementById("messageBox") as HTMLDivElement;

const messages: string[] = [
  "Welcome to our platform!",
  "Check out our latest updates.",
  "Join our newsletter for more.",
  "We value your feedback!",
  "Thanks for visiting!"
];

let currentIndex = 0;

// Function to change the message with fade effect
function showNextMessage() {
  // Optional: Fade out
  messageBox.style.opacity = "0";

  setTimeout(() => {
    messageBox.textContent = messages[currentIndex];
    messageBox.style.opacity = "1";
    currentIndex = (currentIndex + 1) % messages.length;
  }, 500); // Wait for fade-out before updating
}

// Show the first message immediately
showNextMessage();

// Rotate messages every 10 seconds
setInterval(showNextMessage, 10000);
