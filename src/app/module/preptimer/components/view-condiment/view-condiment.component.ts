import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-view-condiment',
  templateUrl: './view-condiment.component.html',
  styleUrl: './view-condiment.component.scss'
})
export class ViewCondimentComponent implements OnInit {
  item: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemService.getItemDetailsById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/preptimer/condiments']);
      }
    });
  }

  formatDuration(duration: string | number): string {
    const totalMinutes = Number(duration);
    if (isNaN(totalMinutes) || totalMinutes < 0) return '';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  }
}
