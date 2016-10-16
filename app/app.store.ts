import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {State, Store} from 'walts'

import {LOCALE} from './constant'
import {AppDispatcher} from './app.dispatcher'
import {ViewName} from './app.routing'
import {ModalDialogParams, ModalDialogType} from './components/modal-dialog.component'
import {ProjectsRepository} from './application/project/projects.repository'
import {ProjectVM} from './application/project/project-vm'

export class AppState extends State {
  currentView?: ViewName
  modalDialog?: ModalDialogParams
  projects?: ProjectsRepository
  currentId?: string
}

const INIT_STATE: AppState = {
  currentView: void 0,
  modalDialog: {
    type: void 0,
    isVisible: false
  },
  projects: void 0,
  currentId: ''
}

@Injectable()
export class AppStore extends Store<AppState> {

  constructor(protected dispatcher: AppDispatcher,
              private projectsRepository: ProjectsRepository) {
    super((() => {
      INIT_STATE.projects = projectsRepository
      return INIT_STATE
    })(), dispatcher)
  }

  get allProjects$(): Observable<ProjectVM[]> {
    return this.projectsRepository.all$.map((projects) => {
      return projects.map((p) => new ProjectVM(p, LOCALE))
    })
  }

  get currentProject$(): Observable<ProjectVM> {
    return this.projectsRepository.single$.map((project) => {
      return new ProjectVM(project, LOCALE)
    })
  }

  getModalDialogIsVisible(): Observable<boolean> {
    return this.observable.map((st) => {
      return st.modalDialog.isVisible
    })
  }

  getModalDialogType(): Observable<ModalDialogType> {
    return this.observable.map((st) => {
      return st.modalDialog.type
    })
  }
}
