import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/api',
      apiPath: 'jarvis',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  mounted() {
    productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (token === '') {
      alert('您尚未登入請重新登入。');
      window.location = 'login.html';
    }

    axios.defaults.headers.common.Authorization = token;

    this.getProduct();
  },
  methods: {
    getProduct(page = 1) {
      const url = `${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url).then((res) => {
        if (res.data.success) {
          this.products = res.data.products;
        } else {
          alert(res.data.message);
        }
      })
    },
    updateProduct() {
      let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
      let method = 'post';
  
      if(!this.isNew) {
        url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put'
      }

      axios[method](url,  { data: this.tempProduct }).then((res) => {
        if(res.data.success) {
          alert(res.data.message);
          productModal.hide();
          this.getProduct();
        } else {
          alert(res.data.message);
        }
      })
    },
    openModal(isNew, item) {
      if(isNew === 'new'){
        this.isNew = true;
        this.tempProduct = {
          imagesUrl: [],
        }
        productModal.show();
      }else if(isNew === 'edit'){
        this.isNew = false;
        this.tempProduct = {...item};
        productModal.show();
      }else if(isNew === 'delete'){
        this.isNew = false;
        this.tempProduct = {...item};
        delProductModal.show();
      }
    },
    delProduct() {
      const url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          delProductModal.hide();
          this.getProduct();
        } else {
          alert(res.data.message);
        }
      });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
}).mount('#app');
