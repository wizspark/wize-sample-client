export class ReportCategory {
  id: number;
  name: string = "";
  description: string = "";
  isActive: boolean;
  modelName: string = "";
  access:string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  modifiedBy: string;
  ReportCategoryFields: ReportCategoryField[] = [];
  selected: boolean = false;
  relatedModels: ReportRelatedModels[] = [];

  clone(isDeepCloning?: boolean){
    let keysArr = Object.keys(this),
        cloneInstance = new ReportCategory();
    for(let keyIndex = 0; keyIndex < keysArr.length; keyIndex++){
      let key = keysArr[keyIndex];
      if(typeof(this[key])!="object"){
        cloneInstance[key] = this[key];
      }else if(typeof(this[key])=="object"){
        if(this[key]['length'] && isDeepCloning){
          cloneInstance[key] = [];
          for(let arrCloneIndex = 0; arrCloneIndex < this[key].length; arrCloneIndex++){
            let arrCloneInstance = this[key][arrCloneIndex].clone();
            cloneInstance[key].push(arrCloneInstance);
          }
        }else if(!isDeepCloning){
          cloneInstance[key] = this[key];
        }
      }
    }
    return cloneInstance;
  }

}

export class ReportRelatedModels {
  modelName: string;
  name: string;
  type: string;
  clone(){
    let keysArr = Object.keys(this),
        cloneInstance = new ReportRelatedModels();
    for(let keyIndex = 0; keyIndex < keysArr.length; keyIndex++){
      let key = keysArr[keyIndex];
      cloneInstance[key] = this[key];
    }
    return cloneInstance;
  }
}

export class ReportCategoryField {
  ReportCategoryId?: number;
  id?: number;
  name: string = "";
  description: string = "";
  dataType: string = null;
  isActive: boolean = true;
  isDefault: boolean = false;
  isMeasure: boolean = false;
  modelName: string = "";
  columnName: string = "";
  access: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  modifiedBy: string;
  selected: boolean = false;
  constructor(model?: ReportCategory){
    if(model){
      this.modelName = model.modelName || "";
    }
  }

  clone(){
    let keysArr = Object.keys(this),
        cloneInstance = new ReportCategoryField();
    for(let keyIndex = 0; keyIndex < keysArr.length; keyIndex++){
      let key = keysArr[keyIndex];
      cloneInstance[key] = this[key];
    }
    return cloneInstance;
  }
}
