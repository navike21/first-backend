import { DEU, ENG, ESP, FRA, ITA, JPN, POR } from '../../../constants'

type TProjectMessage = {
  singleFoundProject: string
  multipleFoundProject: string
  notFoundProject: string
  multipleNotFoundProject: string
  createdProject: string
  updatedProject: string
  deletedProject: string
  multipleDeletedProject: string
}

type TProjectMessageLang = {
  [key: string]: TProjectMessage
}

export const projectMessage: TProjectMessageLang = {
  [ENG]: {
    singleFoundProject: 'Project found',
    multipleFoundProject: 'Projects found',
    notFoundProject: 'Project not found',
    multipleNotFoundProject: 'Projects not found',
    createdProject: 'Project created',
    updatedProject: 'Project updated',
    deletedProject: 'Project deleted',
    multipleDeletedProject: 'Projects deleted'
  },
  [ESP]: {
    singleFoundProject: 'Proyecto encontrado',
    multipleFoundProject: 'Proyectos encontrados',
    notFoundProject: 'Proyecto no encontrado',
    multipleNotFoundProject: 'Proyectos no encontrados',
    createdProject: 'Proyecto creado',
    updatedProject: 'Proyecto actualizado',
    deletedProject: 'Proyecto eliminado',
    multipleDeletedProject: 'Proyectos eliminados'
  },
  [POR]: {
    singleFoundProject: 'Projeto encontrado',
    multipleFoundProject: 'Projetos encontrados',
    notFoundProject: 'Projeto não encontrado',
    multipleNotFoundProject: 'Projetos não encontrados',
    createdProject: 'Projeto criado',
    updatedProject: 'Projeto atualizado',
    deletedProject: 'Projeto excluído',
    multipleDeletedProject: 'Projetos excluídos'
  },
  [FRA]: {
    singleFoundProject: 'Projet trouvé',
    multipleFoundProject: 'Projets trouvés',
    notFoundProject: 'Projet non trouvé',
    multipleNotFoundProject: 'Projets non trouvés',
    createdProject: 'Projet créé',
    updatedProject: 'Projet mis à jour',
    deletedProject: 'Projet supprimé',
    multipleDeletedProject: 'Projets supprimés'
  },
  [DEU]: {
    singleFoundProject: 'Projekt gefunden',
    multipleFoundProject: 'Projekte gefunden',
    notFoundProject: 'Projekt nicht gefunden',
    multipleNotFoundProject: 'Projekte nicht gefunden',
    createdProject: 'Projekt erstellt',
    updatedProject: 'Projekt aktualisiert',
    deletedProject: 'Projekt gelöscht',
    multipleDeletedProject: 'Projekte gelöscht'
  },
  [ITA]: {
    singleFoundProject: 'Progetto trovato',
    multipleFoundProject: 'Progetti trovati',
    notFoundProject: 'Progetto non trovato',
    multipleNotFoundProject: 'Progetti non trovati',
    createdProject: 'Progetto creato',
    updatedProject: 'Progetto aggiornato',
    deletedProject: 'Progetto eliminato',
    multipleDeletedProject: 'Progetti eliminati'
  },
  [JPN]: {
    singleFoundProject: 'プロジェクトが見つかりました',
    multipleFoundProject: 'プロジェクトが見つかりました',
    notFoundProject: 'プロジェクトが見つかりません',
    multipleNotFoundProject: 'プロジェクトが見つかりません',
    createdProject: 'プロジェクトが作成されました',
    updatedProject: 'プロジェクトが更新されました',
    deletedProject: 'プロジェクトが削除されました',
    multipleDeletedProject: 'プロジェクトが削除されました'
  }
}
