class CreateListTypes < ActiveRecord::Migration
  def change
    create_table :list_types do |t|
      t.string :name

      t.timestamps
    end
  end
end
