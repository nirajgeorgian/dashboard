export default function(state = 11, action) {
    switch (action.type) {
      case "STEP_ONE":
        // return action.payload
        return 11;
        break;
      case "STEP_TWO":
        return { }
        break;
      default:
        return state
    }
  }
  