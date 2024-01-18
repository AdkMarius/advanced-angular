import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'username'
})
export class UserNamePipe implements PipeTransform {
  transform(value: { lastName: string, firstName: string}, locale: 'fr' | 'en' = 'fr'): string {
    return (locale === 'fr') ?
      value.lastName.toUpperCase() + " " + value.firstName :
      `${value.firstName} ${value.lastName}`;
  }

}
