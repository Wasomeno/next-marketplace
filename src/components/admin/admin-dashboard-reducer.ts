import invariant from "tiny-invariant";

export interface Action {
  type: ActionTypes;
  open?: boolean;
  dataDetails?: any;
}

interface AdminDashboardStates {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isDeleteModalOpen: boolean;
  dataDetails?: any;
}

type ActionTypes =
  | "set_open_add_modal"
  | "set_open_details_modal"
  | "set_open_edit_modal"
  | "set_open_delete_modal"
  | "set_data_details";

export const adminDashboardState: AdminDashboardStates = {
  isAddModalOpen: false,
  isDetailsModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  dataDetails: {},
};

export function adminDashboardReducer(
  state: AdminDashboardStates,
  action: Action
): AdminDashboardStates {
  switch (action.type) {
    case "set_open_add_modal":
      return { ...state, isAddModalOpen: action.open as boolean };
    case "set_open_edit_modal":
      return { ...state, isEditModalOpen: action.open as boolean };
    case "set_open_details_modal":
      return { ...state, isDetailsModalOpen: action.open as boolean };
    case "set_open_delete_modal":
      return { ...state, isDeleteModalOpen: action.open as boolean };
    case "set_data_details":
      return { ...state, dataDetails: action.dataDetails };
    default:
      return state;
  }
}
