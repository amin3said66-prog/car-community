import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

/**
 * ImgFallbackDirective — adds an onerror fallback to any <img>.
 *
 * Usage:
 *   <img [src]="car.image"  imgFallback="car"    />
 *   <img [src]="user.photo" imgFallback="avatar"  />
 *
 * Accepted values for imgFallback: 'car' | 'avatar' | any direct asset URL.
 */
@Directive({
  selector: 'img[imgFallback]',
  standalone: true,
})
export class ImgFallbackDirective implements OnInit {
  @Input() imgFallback: 'car' | 'avatar' | string = 'avatar';

  private get fallbackSrc(): string {
    if (this.imgFallback === 'car')    return 'fallback-car.svg';
    if (this.imgFallback === 'avatar') return 'fallback-avatar.svg';
    return this.imgFallback; // treat as a direct path
  }

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    const img = this.el.nativeElement;
    if (!img.src || img.src === window.location.href) {
      img.src = this.fallbackSrc;
    }
  }

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement;
    const fb = this.fallbackSrc;
    if (img.src !== fb) {
      img.src = fb;
    }
  }
}
