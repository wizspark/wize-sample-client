import {Component, Input} from '@angular/core';


@Component({
    selector: 'app-modal',
    templateUrl: './modal.html',
    styleUrls: ['./modal.scss']
})
export class ModalComponent {
    @Input() styleClass: string;
    @Input() positionClass: string = 'panel-right';
    public visible = false;
    public visibleAnimate = false;

    constructor(){}

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true, 100);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }

    public onContainerClicked(event: MouseEvent): void {
        if ((<HTMLElement>event.target).classList.contains('modal')) {
            this.hide();
        }
    }

}
