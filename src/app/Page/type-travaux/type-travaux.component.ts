import { Component, OnInit, OnDestroy } from '@angular/core';
import { TypetravauxService } from 'src/app/_services/typetravaux.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UpdateService } from 'src/app/_services/update.service';
import { ModifTravauxComponent } from './modiftravaux/modiftravaux.component';

@Component({
  selector: 'app-type-travaux',
  templateUrl: './type-travaux.component.html',
  styleUrls: ['./type-travaux.component.css']
})
export class TypeTravauxComponent implements OnInit, OnDestroy {
  typeTravauxList: any[] = [];

  modalRef!: BsModalRef;
  updateSubscription!: Subscription;

  constructor(
    private typeTravauxService: TypetravauxService,
    private modalService: BsModalService,
    private updateService: UpdateService
  ) { }

  ngOnInit(): void {
    this.loadTypeTravaux();
    this.updateSubscription = this.updateService.update$.subscribe(() => this.loadTypeTravaux());
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  loadTypeTravaux() {
    this.typeTravauxService.getTypeTravaux().subscribe(
      data => {
        this.typeTravauxList = data;
      },
      error => {
        console.log('Une erreur s\'est produite lors de la récupération des Types de travaux : ', error);
      }
    );
  }

  openModal(idTravaux: any, pu: any, nomTravaux: any) {
    const initialState = {
      idTravaux: idTravaux,
      pu: pu,
      nomTravaux: nomTravaux
    };
    this.modalRef = this.modalService.show(ModifTravauxComponent, { initialState });
  }
}
