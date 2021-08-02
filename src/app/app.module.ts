import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { filter } from 'rxjs/operators';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { ConvocatoriaComponent } from './convocatoria/convocatoria.component';
import { BeneficiadosComponent } from './convocatoria/beneficiados/beneficiados.component';
import { TablaSolicitudComponent } from './tabla-solicitud/tabla-solicitud.component';
import { ModalComponent } from './modal/modal.component';
import { TablaListComponent } from './convocatoria/tabla-list/tabla-list.component';

import { SolicitudService } from './solicitud/solicitud.service';
import { HttpClientModule } from '@angular/common/http';
import { TablaCriteriosComponent } from './convocatoria/tabla-criterios/tabla-criterios.component';



const routes: Routes = [
  { path: 'aspirante', component: SolicitudComponent },
  { path: 'aspirante/:cedula/solicitud', component: SolicitudComponent },
  { path: 'convocatoria', component: ConvocatoriaComponent },
  { path: 'convocatoria/beneficiarios', component: BeneficiadosComponent },
  { path: 'convocatoria/:convocatoria_id', component: ConvocatoriaComponent },
  { path: 'convocatoria/:convocatoria_id/beneficiarios', component: BeneficiadosComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SolicitudComponent,
    ConvocatoriaComponent,
    BeneficiadosComponent,
    TablaSolicitudComponent,
    ModalComponent,
    TablaCriteriosComponent,
    TablaListComponent,
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatAutocompleteModule,
    HttpClientModule,
  ],
  providers: [
    SolicitudService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
