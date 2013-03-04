require 'spec_helper'

describe List do
  context '#name' do
    it 'must exist' do
      @list = List.create(name: '')
      @list.should_not be_valid
    end

    it 'must be unique' do
      @list = List.create(name: 'Things')
      @list.save

      @dup = List.create(name: 'Things')
      @dup.should_not be_valid
    end
  end
end
