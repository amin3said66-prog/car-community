import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <!-- Navigation -->
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            🏎️ Car Community
          </div>
          <div class="hidden md:flex gap-8">
            <a href="#features" class="text-white/80 hover:text-white transition">Features</a>
            <a href="#about" class="text-white/80 hover:text-white transition">About</a>
            <a href="#contact" class="text-white/80 hover:text-white transition">Contact</a>
          </div>
          <button class="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition">
            Get Started
          </button>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span class="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Car Community</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect with car enthusiasts, share your rides, and discover amazing automotive stories
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button class="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
            Explore Cars
          </button>
          <button class="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
            Join Community
          </button>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="max-w-7xl mx-auto px-4 py-20">
        <h2 class="text-4xl font-bold text-white text-center mb-16">Features</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 hover:border-cyan-400/50 transition">
            <div class="text-4xl mb-4">🚗</div>
            <h3 class="text-xl font-semibold text-white mb-4">Car Listings</h3>
            <p class="text-gray-300">Browse and list cars from enthusiasts around the world</p>
          </div>
          <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 hover:border-purple-400/50 transition">
            <div class="text-4xl mb-4">👥</div>
            <h3 class="text-xl font-semibold text-white mb-4">Community</h3>
            <p class="text-gray-300">Connect with like-minded car enthusiasts and share experiences</p>
          </div>
          <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 hover:border-cyan-400/50 transition">
            <div class="text-4xl mb-4">📸</div>
            <h3 class="text-xl font-semibold text-white mb-4">Showcase</h3>
            <p class="text-gray-300">Share photos and videos of your favorite rides</p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="max-w-7xl mx-auto px-4 py-20">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">10K+</div>
            <p class="text-gray-300 mt-2">Active Members</p>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">5K+</div>
            <p class="text-gray-300 mt-2">Cars Listed</p>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">50K+</div>
            <p class="text-gray-300 mt-2">Posts & Comments</p>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">100+</div>
            <p class="text-gray-300 mt-2">Events Organized</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="max-w-7xl mx-auto px-4 py-20 text-center">
        <div class="backdrop-blur-md bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-12">
          <h2 class="text-3xl font-bold text-white mb-4">Ready to Join?</h2>
          <p class="text-gray-300 mb-8">Start sharing your passion for cars today</p>
          <button class="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
            Sign Up Now
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-white/20 backdrop-blur-md bg-white/5 mt-20">
        <div class="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400">
          <p>&copy; 2026 Car Community. All rights reserved. Built with ❤️ and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class HomeComponent {

}
