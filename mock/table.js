export default [
  {
    url: "/user/list",
    type: "post",
    response: config => {
      const userList = [
        {
          name: "A1",
          phone: "13512312312",
          realName: "1",
          wwt: "12",
          poolNum: "21",
          status: "enable",
          superior: "13123564556"
        },
        {
          name: "A2",
          phone: "13512312312",
          realName: "0",
          wwt: "12",
          status: "disable",
          poolNum: "21",
          superior: ""
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
    url: "/pool/list",
    type: "post",
    response: config => {
      const poolList = [
        { type: "小试牛刀", wwt: "10", rate: "10", cycle: "30", profit: "1" },
        { type: "初露锋芒", wwt: "100", rate: "20", cycle: "30", profit: "20" },
        {
          type: "大显身手",
          wwt: "1000",
          rate: "30",
          cycle: "30",
          profit: "300"
        },
        {
          type: "出神入化",
          wwt: "10000",
          rate: "35",
          cycle: "30",
          profit: "350"
        }
      ];

      return {
        code: 20000,
        data: {
          total: poolList.length,
          items: poolList
        }
      };
    }
  },
  {
    url: "/role/list",
    type: "get",
    response: config => {
      const list = [
        { id: 0, name: "超级管理员", auth: ["all"] },
        {
          id: 1,
          name: "运营",
          auth: ["wwt", "order", "notity", "feedback", "user"]
        },
        {
          id: 2,
          name: "运营2",
          auth: ["wwt", "order", "feedback", "user"]
        },
        {
          id: 3,
          name: "运营3",
          auth: ["wwt", "order", "notity", "feedback"]
        },
        {
          id: 4,
          name: "运营4",
          auth: ["wwt", "order", "notity", "user"]
        },
        {
          id: 5,
          name: "运营5",
          auth: ["wwt", "order", "notity", "feedback", "user"]
        },
        {
          id: 6,
          name: "运营6",
          auth: ["order", "notity", "feedback", "user"]
        },
        {
          id: 7,
          name: "运营7",
          auth: ["wwt", "notity", "feedback", "user"]
        }
      ];

      return {
        code: 20000,
        data: list
      };
    }
  },
  {
    url: "/manegement/list",
    type: "get",
    response: config => {
      const list = [
        {
          id: 0,
          phone: "13453445670",
          roles: [{ id: 0, name: "超级管理员", auth: ["all"] }],
          status: "enable"
        },
        {
          id: 1,
          phone: "13453445678",
          roles: [
            {
              id: 1,
              name: "运营",
              auth: ["wwt", "order", "notity", "feedback", "user"]
            }
          ],
          status: "enable"
        }
      ];

      return {
        code: 20000,
        data: list
      };
    }
  },
  {
    url: "/bms/market/list",
    type: "post",
    response: config => {
      const list = [
        {
          orderId: "1",
          buyPhone: "13232323232",
          sellerPhone: "15345678967",
          number: "10",
          cny: "45",
          price: "23",
          type: "普通",
          time: "2019/2/1",
          serviceCharge: "45",
          status: "MATCHING"
        },
        {
          orderId: "1",
          buyPhone: "13232323232",
          sellerPhone: "15345678967",
          number: "10",
          cny: "45",
          price: "23",
          type: "普通",
          time: "2019/2/1",
          serviceCharge: "45",
          status: "MATCHING"
        }
      ];

      return {
        code: 20000,
        data: list
      };
    }
  },
  {
    url: "/bms/ann/list",
    type: "post",
    response: config => {
      const list = [
        {
          commitTime: '2019/2/2',
          content: "是的冯绍峰",
          id: 1,
          title: "标题 1"
        },
        {
          commitTime: 0,
          content: "sdl是的冯绍峰水电费是的冯绍峰是的冯绍峰水电费",
          id: 2,
          title: "标体2"
        }
      ];

      return {
        code: 20000,
        data: list
      };
    }
  }
];
