import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AbstractAppConfig } from '../../../app.config';
import { AddressModel } from '../../domain/addresses';
import { HttpService } from '../http';
import {map} from "rxjs/operators";
import 'rxjs/add/observable/of';

@Injectable()
export class AddressesService {

  private static readonly DPA = 'DPA';

  private static readonly UK = 'UK';

  constructor(
    private http: HttpService,
    private appConfig: AbstractAppConfig
  ) {}

  getAddressesForPostcode(postcode: string): Observable<Array<AddressModel>> {
    return this.http
      .get(this.appConfig.getPostcodeLookupUrl()
        .replace('${postcode}', postcode), undefined,false)
      .pipe(
        map(res=> res.json().results)
       ).pipe(
        map(output => output.map(addresses=>
            this.mapToAddressModel(addresses[AddressesService.DPA])
        )
      ));
  }

  private mapToAddressModel(address:any) {
    let addressModel = new AddressModel();
    let addressLine = this.removeNonAddressValues(
      `${address.ORGANISATION_NAME} ${address.DEPARTMENT_NAME} ${address.PO_BOX_NUMBER}`)
    if (addressLine != '') addressModel.AddressLine1 = addressLine;
    addressModel.AddressLine2 = this.removeNonAddressValues(
      `${address.BUILDING_NAME} ${address.SUB_BUILDING_NAME} ${address.BUILDING_NUMBER} ${address.THOROUGHFARE_NAME}`);
    addressModel.AddressLine3 = this.removeNonAddressValues(
      `${address.DEPENDENT_LOCALITY} ${address.DOUBLE_DEPENDENT_LOCALITY} ${address.DEPENDENT_THOROUGHFARE_NAME}`);
    addressModel.PostCode = address.POSTCODE;
    addressModel.PostTown = address.POST_TOWN;
    addressModel.Country = AddressesService.UK;
    addressModel = this.shiftAddressLinesUp(addressModel);
    this.formatAddressLines(addressModel);
    return addressModel;
  }

  private formatAddressLines(addressModel) {
    ['AddressLine1', 'AddressLine2', 'AddressLine3', 'PostTown'].forEach(value => {
      addressModel[value] = this.toCapitalCase(addressModel[value]);
    });
  }

  private shiftAddressLinesUp(addressModel:AddressModel) {
    if (addressModel.AddressLine1 == '') {
      addressModel.AddressLine1 = addressModel.AddressLine2;
      addressModel.AddressLine2 = '';
    }
    if (addressModel.AddressLine2 == '') {
      addressModel.AddressLine2 = addressModel.AddressLine3;
      addressModel.AddressLine3 = '';
    }
    return addressModel;
  }

  private toCapitalCase(sentence:string) {
   sentence = sentence.toLowerCase();
   sentence.split(' ').forEach((value, index) => {
        sentence = sentence.replace(value, value.charAt(0).toUpperCase() + value.substr(1));
      }
    )
    return sentence;
  }

  private removeNonAddressValues(line: string) {
    line = line.replace(" null", ' ').replace("null ", ' ');
    line = this.removeUndefinedString(line);
    line = this.removeEmptySpaces(line);
    line = this.removeInitialComma(line);
    return line;
  };

  private removeUndefinedString(value:string) {
    return value.replace(new RegExp("undefined","gi"), '')
  }

  private removeEmptySpaces(value:string) {
    return value.replace(new RegExp(" +", "gi"), ' ').trim();
  }

  private removeInitialComma(value:string) {
    return value.replace(new RegExp("^,", "gi"),'');
  }

}

