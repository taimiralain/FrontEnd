import _ from 'underscore';

export class ArrayManipulations{

  static isReverseSort(category: string): boolean{
    return  category.split(' ').length === 2 ;
  }

  static sortItemsBy(items: any[], category: string): any[]{
    return this.isReverseSort(category) ? _.sortBy( items, category ).reverse() : _.sortBy( items, category );
  }

  static selectItemsFromPage(items: any[], itemsInPage: number, pageNumber: number): any[] {
    const startIndex = (pageNumber - 1) * itemsInPage;
    const endIndex = startIndex + itemsInPage;
    return items.slice(startIndex, endIndex);
  }
}
