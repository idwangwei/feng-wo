
export default [
  {
    url: '/user/list',
    type: 'post',
    response: config => {
      const userList = [
        {
          name: 'A1',
          phone: '13512312312',
          realName: '1',
          wwt: '12',
          poolNum: '21',
          status: 'enable',
          superior: '13123564556'
        },
        {
          name: 'A2',
          phone: '13512312312',
          realName: '0',
          wwt: '12',
          status: 'disable',
          poolNum: '21',
          superior: ''
        }
      ];

      return {
        code: 20000,
        data: {
          total: userList.length,
          items: userList
        }
      };
    }
  },
  {
    url: '/pool/list',
    type: 'post',
    response: config => {
      const poolList = [
        { type: '小试牛刀', wwt: '10', rate: '10', cycle: '30', profit: '1' },
        { type: '初露锋芒', wwt: '100', rate: '20', cycle: '30', profit: '20' },
        { type: '大显身手', wwt: '1000', rate: '30', cycle: '30', profit: '300' },
        { type: '出神入化', wwt: '10000', rate: '35', cycle: '30', profit: '350' }
      ];

      return {
        code: 20000,
        data: {
          total: poolList.length,
          items: poolList
        }
      };
    }
  }
];
