import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements AfterViewInit {
  leftLegFirstLevel = Array(5).fill(0);
  rightLegFirstLevel = Array(5).fill(0);
  
  // Each node in the first level has 10 children for a total of 100 on the bottom
  secondLevelChildren = Array(10).fill(0);

  currentBookPage = 0;
  totalBookPages = 6;
  flipDirection: 'forward' | 'backward' = 'forward';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.centerScroll();
  }

  centerScroll() {
    setTimeout(() => {
      if (this.scrollContainer) {
        const container = this.scrollContainer.nativeElement;
        container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      }
    }, 150);
  }

  nextBookPage() {
    if (this.currentBookPage < this.totalBookPages - 1) {
      this.flipDirection = 'forward';
      this.currentBookPage++;
    }
  }

  prevBookPage() {
    if (this.currentBookPage > 0) {
      this.flipDirection = 'backward';
      this.currentBookPage--;
    }
  }
}

