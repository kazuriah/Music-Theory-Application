const keySignatures = {
  aFlat: {
    maj: {
      key: ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'],
      relative: 'f.min',
    },
    min: {
      key: ['A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F♭', 'G♭'],
      relative: 'cFlat.maj',
    },
  },
  a: {
    maj: {
      key: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'],
      relative: 'fSharp.min',
    },
    min: {
      key: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      relative: 'c.maj',
    },
  },
  aSharp: {
    maj: {
      key: ['A♯', 'B♯', 'C♯♯', 'D♯', 'E♯', 'F♯♯', 'G♯♯'],
      relative: '',
    },
    min: {
      key: ['A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯', 'G♯'],
      relative: 'cSharp.maj',
    },
  },
  bFlat: {
    maj: {
      key: ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'],
      relative: 'g.min',
    },
    min: {
      key: ['B♭', 'C', 'D♭', 'E♭', 'F', 'G♭', 'A♭'],
      relative: 'dFlat.maj',
    },
  },
  b: {
    maj: {
      key: ['B', 'C♯', 'D♯', 'E♯', 'F♯', 'G♯', 'A♯'],
      relative: 'gSharp.min',
    },
    min: {
      key: ['B', 'C♯', 'D', 'E', 'F♯', 'G', 'A'],
      relative: 'd.maj',
    },
  },
  c: {
    maj: {
      key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      relative: 'a.min',
    },
    min: {
      key: ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B♭'],
      relative: 'eFlat.maj',
    },
  },
  cSharp: {
    maj: {
      key: ['C♯', 'D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B♯'],
      relative: 'aSharp.min',
    },
    min: {
      key: ['C♯', 'D♯', 'E', 'F♯', 'G♯', 'A', 'B'],
      relative: 'e.maj',
    },
  },
  dFlat: {
    maj: {
      key: ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'],
      relative: 'bFlat.min',
    },
    min: {
      key: ['D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭♭', 'C♭'],
      relative: 'fFlat.maj',
    },
  },
  d: {
    maj: {
      key: ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'],
      relative: 'b.min',
    },
    min: {
      key: ['D', 'E', 'F', 'G', 'A', 'B♭', 'C'],
      relative: 'f.maj',
    },
  },
  dSharp: {
    maj: {
      key: [],
      relative: '',
    },
    min: {
      key: [],
      relative: '',
    },
  },
  eFlat: {
    maj: {
      key: ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'],
      relative: 'c.min',
    },
    min: {
      key: ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭', 'D♭'],
      relative: 'gFlat.maj',
    },
  },
  e: {
    maj: {
      key: ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'],
      relative: 'cSharp.min',
    },
    min: {
      key: ['E', 'F♯', 'G', 'A', 'B', 'C', 'D'],
      relative: 'g.maj',
    },
  },
  fFlat: {
    maj: {
      key: ['F♭', 'G♭', 'A♭', 'B♭♭', 'C♭', 'D♭', 'E♭'],
      relative: 'dFlat.min',
    },
    min: {
      key: [],
      relative: '',
    },
  },
  f: {
    maj: {
      key: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'],
      relative: 'd.min',
    },
    min: {
      key: ['F', 'G', 'A♭', 'B♭', 'C', 'D♭', 'E♭'],
      relative: 'aFlat.maj',
    },
  },
  fSharp: {
    maj: {
      key: ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯'],
      relative: 'dSharp.min',
    },
    min: {
      key: [],
      relative: '',
    },
  },
  gFlat: {
    maj: {
      key: [],
      relative: '',
    },
    min: {
      key: [],
      relative: '',
    },
  },
  g: {
    maj: {
      key: ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'],
      relative: '',
    },
    min: {
      key: ['G', 'A', 'B♭', 'C', 'D', 'E♭', 'F'],
      relative: '',
    },
  },
  gSharp: {
    maj: {
      key: [],
      relative: '',
    },
    min: {
      key: [],
      relative: '',
    },
  },

};

export default keySignatures;
