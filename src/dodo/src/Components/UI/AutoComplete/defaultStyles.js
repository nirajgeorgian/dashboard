const defaultStyles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
  },
  input: {
    display: 'inline-block',
    width: '100% !important',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #96c8da',
    width: '100%',
    zIndex: '13',
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: '7px',
    color: '#0057D8',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: 'rgba(0,0,0,.03)',
  },
};

export default defaultStyles;
