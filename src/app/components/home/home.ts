import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initPlugins();
    }, 150);
  }

  initPlugins(): void {

    // =====================
    // WOW JS
    // =====================
    if ((window as any).WOW) {
      new (window as any).WOW().init();
    }

    // =====================
    // HEADER CAROUSEL
    // =====================
    if ($('.header-carousel').length) {
      ($('.header-carousel') as any).owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        nav: false
      });
    }

    // =====================
    // TESTIMONIALS (IMPORTANT)
    // =====================
    if ($('.testimonial-carousel').length) {
      ($('.testimonial-carousel') as any).owlCarousel({
        loop: true,
        margin: 30,
        autoplay: true,
        dots: true,
        responsive: {
          0: { items: 1 },
          768: { items: 1 },
          1000: { items: 2 }
        }
      });
    }

    // =====================
    // COUNTER UP FIXED
    // =====================
    $('[data-toggle="counter-up"]').each((i: number, el: any) => {
      $(el).counterUp({
        delay: 10,
        time: 2000
      });
    });

    // =====================
    // BACK TO TOP
    // =====================
    $(window).on('scroll', () => {
      if ($(window).scrollTop()! > 300) {
        $('.back-to-top').fadeIn();
      } else {
        $('.back-to-top').fadeOut();
      }
    });

    $('.back-to-top').on('click', () => {
      $('html, body').animate({ scrollTop: 0 }, 500);
      return false;
    });

  }
}