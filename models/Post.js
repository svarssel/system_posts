const mongoose = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    photo:String,
    title:{
        type:String,
        trim:true,
        required:'O post precisa de um titulo'
    },
    slug:String,
    body:{
        type:String,
        trim:true
    },
    tags:[String]
});

/* Mecanismo para criar um post igual, porém, automaticamente ele atribuirá um valor para não dar conflito no titulo do slug */

postSchema.pre('save', async function(next) {
    if(this.isModified('title')) {
        this.slug = slug( this.title, {lower:true} );

        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`, 'i');
        const postsWithSlug = await this.constructor.find({ slug: slugRegex }); // vai fazer uma consulta no Banco de Dados para ver se tem aquele determinado slug


        if (postsWithSlug.length > 0) { //se não exsitir, blz, vai salvar o item, mas se existir, ele troca o slug para o proximo da sequência
            this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
        }
    }

    next();
});

postSchema.statics.getTagsList = function() {
   return this.aggregate([
       { $unwind:'$tags' },
       { $group: { _id: '$tags', count: { $sum: 1 } } },//agrupar de acordo com as tags e       e quantas vezes de posts que terá naquele grupo.
       { $sort: { count:-1 } } //ficar em ordem decrescente.
        
   ]); 
}

module.exports = mongoose.model('Post', postSchema);